import os
import json
from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from typing import List
from pathlib import Path

# slowapi: librería para limitar la cantidad de requests por IP
# evita que alguien abuse de la API y agote la cuota de Gemini
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from parser import extraer_texto_pdf
from prompt import PROMPT_SISTEMA, construir_prompt_usuario

# Carga las variables del archivo .env
load_dotenv(dotenv_path=Path(__file__).parent / ".env")

# ─── Configuración desde variables de entorno ─────────────────────
# Todas estas se configuran en Railway — nunca hardcodeadas en el código
IA_PROVIDER    = os.getenv("IA_PROVIDER", "gemini")       # qué IA usar
FRONTEND_URL   = os.getenv("FRONTEND_URL", "*")           # URL de Vercel para CORS
MAX_SIZE_MB    = int(os.getenv("MAX_SIZE_MB", "10"))       # límite de tamaño en MB
MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024                 # convertido a bytes

# Extensiones de imagen aceptadas
EXTENSIONES_IMAGEN = {".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"}

# Mapeo de extensión a tipo MIME
MIME_MAP = {
    ".jpg":  "image/jpeg",
    ".jpeg": "image/jpeg",
    ".heic": "image/jpeg",
    ".heif": "image/jpeg",
    ".png":  "image/png",
    ".webp": "image/webp",
}

# ─── Inicialización de la app ─────────────────────────────────────

# Limiter: controla cuántas requests acepta por IP por minuto
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="MediSync API")

# Registrar el limiter en la app
app.state.limiter = limiter

# Registrar el handler de error cuando se supera el límite
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS: controla qué dominios pueden llamar a esta API
# En desarrollo: acepta todo ("*")
# En producción: solo acepta requests del frontend en Vercel
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL] if FRONTEND_URL != "*" else ["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


# ─── Funciones de IA ──────────────────────────────────────────────

def llamar_gemini(texto_pdf: str) -> dict:
    """Llama a Gemini con texto extraído de un PDF."""
    import google.generativeai as genai
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

    model = genai.GenerativeModel(
        model_name="gemini-2.5-flash",
        system_instruction=PROMPT_SISTEMA,
    )
    respuesta = model.generate_content(
        construir_prompt_usuario(texto_pdf),
        generation_config=genai.GenerationConfig(
            temperature=0.2,                        # baja temperatura = respuestas consistentes
            response_mime_type="application/json",  # fuerza JSON puro sin texto extra
        ),
    )
    texto = respuesta.text.strip()
    # Limpiar por si Gemini agrega backticks de markdown
    if texto.startswith("```"):
        texto = texto.split("```")[1]
        if texto.startswith("json"):
            texto = texto[4:]
    return json.loads(texto.strip())


def llamar_gemini_vision(imagenes: list, texto_extra: str = "") -> dict:
    """
    Llama a Gemini Vision con una o varias imágenes.
    Permite procesar fotos de análisis clínicos de celular.
    """
    import google.generativeai as genai
    import base64
    from PIL import Image
    import io

    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    model = genai.GenerativeModel(
        model_name="gemini-2.5-flash",
        system_instruction=PROMPT_SISTEMA,
    )

    # Construir lista de partes: primero las imágenes, después el texto
    partes = []
    for img_data in imagenes:
        imagen_bytes = base64.b64decode(img_data["b64"])
        imagen = Image.open(io.BytesIO(imagen_bytes))
        # Convertir a RGB si es necesario (algunos formatos como HEIC pueden venir en otro modo)
        if imagen.mode not in ("RGB", "RGBA"):
            imagen = imagen.convert("RGB")
        partes.append(imagen)

    # Agregar el prompt de texto al final
    prompt_texto = construir_prompt_usuario(
        texto_extra if texto_extra.strip()
        else "El analisis clinico viene en las imagenes adjuntas. Extraé todos los biomarcadores."
    )
    partes.append(prompt_texto)

    respuesta = model.generate_content(
        partes,
        generation_config=genai.GenerationConfig(
            temperature=0.2,
            response_mime_type="application/json",
        ),
    )
    texto = respuesta.text.strip()
    if texto.startswith("```"):
        texto = texto.split("```")[1]
        if texto.startswith("json"):
            texto = texto[4:]
    return json.loads(texto.strip())


def llamar_openai(texto_pdf: str) -> dict:
    """Llama a GPT-4o como alternativa a Gemini."""
    from openai import OpenAI
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    respuesta = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": PROMPT_SISTEMA},
            {"role": "user",   "content": construir_prompt_usuario(texto_pdf)},
        ],
        temperature=0.2,
        response_format={"type": "json_object"},
    )
    return json.loads(respuesta.choices[0].message.content)


def llamar_claude(texto_pdf: str) -> dict:
    """Llama a Claude como alternativa a Gemini."""
    import anthropic
    client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    respuesta = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=4096,
        system=PROMPT_SISTEMA,
        messages=[{"role": "user", "content": construir_prompt_usuario(texto_pdf)}],
    )
    texto = respuesta.content[0].text.strip()
    if texto.startswith("```"):
        texto = texto.split("```")[1]
        if texto.startswith("json"):
            texto = texto[4:]
    return json.loads(texto.strip())


# ─── Endpoints ────────────────────────────────────────────────────

@app.get("/")
def health():
    """Health check — confirma que el servidor está corriendo."""
    return {"status": "ok", "producto": "MediSync", "ia": IA_PROVIDER}


@app.post("/analizar")
@limiter.limit("10/minute")  # máximo 10 análisis por minuto por IP
async def analizar_archivos(request: Request, archivos: List[UploadFile] = File(...)):
    """
    Endpoint principal. Acepta uno o varios archivos (PDF o imágenes)
    y devuelve el JSON con biomarcadores interpretados por IA.
    """
    if not archivos:
        raise HTTPException(status_code=400, detail="No se recibio ningun archivo.")

    texto_total  = ""
    imagenes_b64 = []
    total_bytes  = 0

    for archivo in archivos:
        nombre    = archivo.filename.lower()
        contenido = await archivo.read()
        extension = Path(nombre).suffix

        # ── Validación de tamaño ──────────────────────────────────
        # Verificar que cada archivo individual no supere el límite
        total_bytes += len(contenido)
        if len(contenido) > MAX_SIZE_BYTES:
            raise HTTPException(
                status_code=400,
                detail=f"El archivo {archivo.filename} supera el límite de {MAX_SIZE_MB}MB."
            )
        # Verificar que el total de todos los archivos no supere el doble del límite
        if total_bytes > MAX_SIZE_BYTES * 2:
            raise HTTPException(
                status_code=400,
                detail="El total de archivos supera el límite permitido."
            )

        # ── Procesamiento según tipo de archivo ───────────────────
        if extension == ".pdf":
            # Validar que sea un PDF real verificando los magic bytes
            # Los PDFs siempre empiezan con "%PDF"
            if not contenido.startswith(b"%PDF"):
                raise HTTPException(
                    status_code=400,
                    detail=f"{archivo.filename} no parece ser un PDF válido."
                )
            texto = extraer_texto_pdf(contenido)
            texto_total += f"\n{texto}"

        elif extension in EXTENSIONES_IMAGEN:
            # Validar que sea una imagen real verificando los magic bytes
            # Cada formato de imagen tiene una firma única en los primeros bytes
            MAGIC = {
                b"\xff\xd8\xff": "image/jpeg",  # JPG
                b"\x89PNG":      "image/png",   # PNG
                b"RIFF":         "image/webp",  # WEBP
            }
            mime_real = None
            for magic, mime in MAGIC.items():
                if contenido[:len(magic)] == magic:
                    mime_real = mime
                    break

            # Si no detectamos el tipo por magic bytes, usar el MIME de la extensión
            if not mime_real:
                mime_real = MIME_MAP.get(extension, "image/jpeg")

            import base64
            b64 = base64.b64encode(contenido).decode("utf-8")
            imagenes_b64.append({"b64": b64, "mime": mime_real})

        else:
            raise HTTPException(
                status_code=400,
                detail=f"Formato no soportado: {archivo.filename}. Usá PDF, JPG, PNG o WEBP."
            )

    # Verificar que se pudo extraer texto del PDF (si no hay imágenes)
    if len(texto_total.strip()) < 50 and not imagenes_b64:
        raise HTTPException(
            status_code=422,
            detail="No se pudo extraer texto del PDF. Probá subiendo una foto del análisis."
        )

    # ── Llamada a la IA ───────────────────────────────────────────
    try:
        # Si hay imágenes, usar Gemini Vision sin importar el IA_PROVIDER
        if imagenes_b64:
            resultado = llamar_gemini_vision(imagenes_b64, texto_total)
        elif IA_PROVIDER == "claude":
            resultado = llamar_claude(texto_total)
        elif IA_PROVIDER == "openai":
            resultado = llamar_openai(texto_total)
        else:
            # Por defecto: Gemini
            resultado = llamar_gemini(texto_total)

    except json.JSONDecodeError:
        # La IA devolvió algo que no es JSON válido
        raise HTTPException(
            status_code=500,
            detail="La IA devolvio una respuesta invalida. Intenta de nuevo."
        )
    except Exception as e:
        # Cualquier otro error (API key incorrecta, cuota agotada, etc.)
        raise HTTPException(
            status_code=500,
            detail=f"Error al procesar con IA: {str(e)}"
        )

    return resultado


@app.get("/mock")
def mock():
    """Devuelve datos de prueba para que el frontend pueda desarrollar sin el backend."""
    try:
        with open("mock.json", "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="mock.json no encontrado.")