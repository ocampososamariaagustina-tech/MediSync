import os
import json
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from parser import extraer_texto_pdf
from prompt import PROMPT_SISTEMA, construir_prompt_usuario
from pathlib import Path
load_dotenv(dotenv_path=Path(__file__).parent / ".env")

app = FastAPI(title="MediSync API")

# CORS abierto para que Dev B pueda llamar desde localhost sin problemas
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Selector de IA ───────────────────────────────────────────────
# Cambiá IA_PROVIDER en el .env a "openai" o "claude"
IA_PROVIDER = os.getenv("IA_PROVIDER", "gemini")


def llamar_openai(texto_pdf: str) -> dict:
    from openai import OpenAI
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    respuesta = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": PROMPT_SISTEMA},
            {"role": "user",   "content": construir_prompt_usuario(texto_pdf)},
        ],
        temperature=0.2,       # baja temperatura = respuestas consistentes
        response_format={"type": "json_object"},  # fuerza JSON puro
    )
    return json.loads(respuesta.choices[0].message.content)


def llamar_claude(texto_pdf: str) -> dict:
    import anthropic
    client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

    respuesta = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=4096,
        system=PROMPT_SISTEMA,
        messages=[
            {"role": "user", "content": construir_prompt_usuario(texto_pdf)},
        ],
    )
    # Claude devuelve texto — parseamos el JSON del contenido
    texto = respuesta.content[0].text.strip()
    # Limpiamos por si acaso viene con backticks
    if texto.startswith("```"):
        texto = texto.split("```")[1]
        if texto.startswith("json"):
            texto = texto[4:]
    return json.loads(texto.strip())

def llamar_gemini(texto_pdf: str) -> dict:
    import google.generativeai as genai
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


    model = genai.GenerativeModel(
        model_name="gemini-2.5-flash",
        system_instruction=PROMPT_SISTEMA,
    )

    respuesta = model.generate_content(
        construir_prompt_usuario(texto_pdf),
        generation_config=genai.GenerationConfig(
            temperature=0.2,
            response_mime_type="application/json",
        ),
    )

    return json.loads(respuesta.text)
# ─── Endpoints ────────────────────────────────────────────────────

@app.get("/")
def health():
    return {"status": "ok", "producto": "MediSync", "ia": IA_PROVIDER}


@app.post("/analizar")
async def analizar_pdf(archivo: UploadFile = File(...)):
    """
    Recibe un PDF, extrae el texto, lo procesa con IA
    y devuelve JSON estructurado listo para el frontend.
    """
    # Validar que sea PDF
    if not archivo.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="El archivo debe ser un PDF.")

    # Leer bytes
    pdf_bytes = await archivo.read()
    if len(pdf_bytes) == 0:
        raise HTTPException(status_code=400, detail="El archivo está vacío.")

    # Extraer texto
    texto = extraer_texto_pdf(pdf_bytes)
    if len(texto) < 50:
        raise HTTPException(
            status_code=422,
            detail="No se pudo extraer texto del PDF. ¿Es un PDF escaneado sin OCR?"
        )

    # Llamar a la IA elegida
    try:
        if IA_PROVIDER == "claude":
            resultado = llamar_claude(texto)
        elif IA_PROVIDER == "gemini":
            resultado = llamar_gemini(texto)
        else:
            resultado = llamar_openai(texto)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="La IA devolvió una respuesta inválida. Intentá de nuevo.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al procesar con IA: {str(e)}")

    return resultado


@app.get("/mock")
def mock():
    """
    Devuelve el JSON hardcodeado para que Dev B arranque
    el frontend sin necesitar el backend real todavía.
    """
    try:
        with open("mock.json", "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="mock.json no encontrado.")