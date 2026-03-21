import os
import json
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from typing import List

from parser import extraer_texto_pdf
from prompt import PROMPT_SISTEMA, construir_prompt_usuario
from pathlib import Path

load_dotenv(dotenv_path=Path(__file__).parent / ".env")

app = FastAPI(title="MediSync API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

IA_PROVIDER = os.getenv("IA_PROVIDER", "gemini")

EXTENSIONES_IMAGEN = {".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"}
MIME_MAP = {
    ".jpg":  "image/jpeg",
    ".jpeg": "image/jpeg",
    ".heic": "image/jpeg",
    ".heif": "image/jpeg",
    ".png":  "image/png",
    ".webp": "image/webp",
}


def llamar_gemini(texto_pdf: str) -> dict:
    import google.generativeai as genai
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

    model = genai.GenerativeModel(
        model_name="gemini-2.0-flash",
        system_instruction=PROMPT_SISTEMA,
    )

    respuesta = model.generate_content(
        construir_prompt_usuario(texto_pdf),
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


def llamar_gemini_vision(imagenes: list, texto_extra: str = "") -> dict:
    import google.generativeai as genai
    import base64
    from PIL import Image
    import io

    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

    model = genai.GenerativeModel(
        model_name="gemini-2.5-flash",
        system_instruction=PROMPT_SISTEMA,
    )

    partes = []

    for img_data in imagenes:
        imagen_bytes = base64.b64decode(img_data["b64"])
        imagen = Image.open(io.BytesIO(imagen_bytes))
        if imagen.mode not in ("RGB", "RGBA"):
            imagen = imagen.convert("RGB")
        partes.append(imagen)

    prompt_texto = construir_prompt_usuario(
        texto_extra if texto_extra.strip()
        else "El analisis clinico viene en las imagenes adjuntas. Extraé todos los biomarcadores que puedas ver."
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


@app.get("/")
def health():
    return {"status": "ok", "producto": "MediSync", "ia": IA_PROVIDER}


@app.post("/analizar")
async def analizar_archivos(archivos: List[UploadFile] = File(...)):
    if not archivos:
        raise HTTPException(status_code=400, detail="No se recibio ningun archivo.")

    texto_total  = ""
    imagenes_b64 = []

    for archivo in archivos:
        nombre    = archivo.filename.lower()
        contenido = await archivo.read()
        extension = Path(nombre).suffix

        if extension == ".pdf":
            texto = extraer_texto_pdf(contenido)
            texto_total += f"\n{texto}"

        elif extension in EXTENSIONES_IMAGEN:
            import base64
            b64  = base64.b64encode(contenido).decode("utf-8")
            mime = MIME_MAP.get(extension, "image/jpeg")
            imagenes_b64.append({"b64": b64, "mime": mime})

        else:
            raise HTTPException(
                status_code=400,
                detail=f"Formato no soportado: {archivo.filename}. Usa PDF, JPG, PNG o WEBP."
            )

    if len(texto_total.strip()) < 50 and not imagenes_b64:
        raise HTTPException(
            status_code=422,
            detail="No se pudo extraer texto del PDF. Es un PDF escaneado? Intenta subir una foto."
        )

    try:
        if imagenes_b64:
            resultado = llamar_gemini_vision(imagenes_b64, texto_total)
        elif IA_PROVIDER == "claude":
            resultado = llamar_claude(texto_total)
        elif IA_PROVIDER == "openai":
            resultado = llamar_openai(texto_total)
        else:
            resultado = llamar_gemini(texto_total)

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="La IA devolvio una respuesta invalida. Intenta de nuevo."
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al procesar con IA: {str(e)}"
        )

    return resultado


@app.get("/mock")
def mock():
    try:
        with open("mock.json", "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="mock.json no encontrado.")