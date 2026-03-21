import fitz  # PyMuPDF

def extraer_texto_pdf(pdf_bytes: bytes) -> str:
    """
    Extrae texto de un PDF con múltiples estrategias para
    manejar distintos formatos de laboratorio.
    """
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    texto_total = ""

    for num_pagina, pagina in enumerate(doc):
        # Estrategia 1: extracción estándar preservando layout
        texto = pagina.get_text("text")

        # Si la página tiene poco texto, intentar con layout más agresivo
        if len(texto.strip()) < 100:
            texto = pagina.get_text("blocks")
            if isinstance(texto, list):
                texto = "\n".join([b[4] for b in texto if isinstance(b[4], str)])

        texto_total += f"\n--- Página {num_pagina + 1} ---\n{texto}"

    doc.close()

    # Limpiar caracteres problemáticos que confunden a la IA
    texto_total = texto_total.replace('\x00', '')  # null bytes
    texto_total = texto_total.replace('\r\n', '\n')
    texto_total = texto_total.replace('\r', '\n')

    # Colapsar líneas en blanco múltiples
    import re
    texto_total = re.sub(r'\n{3,}', '\n\n', texto_total)

    return texto_total.strip()