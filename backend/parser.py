import fitz  # PyMuPDF

def extraer_texto_pdf(pdf_bytes: bytes) -> str:
    """
    Recibe los bytes de un PDF y devuelve todo el texto extraído.
    fitz abre desde bytes directamente, sin necesidad de guardar el archivo.
    """
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    texto = ""
    for pagina in doc:
        texto += pagina.get_text()
    doc.close()
    return texto.strip()