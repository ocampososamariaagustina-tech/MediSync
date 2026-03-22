<div align="center">

<img src="frontend/src/assets/vite.svg" width="320" alt="MediSync banner"/>

**Porque los datos de tu cuerpo no deberían ser un secreto para ti.**

![Deploy](https://img.shields.io/badge/deploy-Vercel-black?logo=vercel)
![Backend](https://img.shields.io/badge/backend-Railway-purple?logo=railway)
![IA](https://img.shields.io/badge/IA-Gemini%202.0-blue?logo=google)
![Python](https://img.shields.io/badge/Python-3.10+-yellow?logo=python)
![React](https://img.shields.io/badge/React-Vite-61dafb?logo=react)

[🌐 Ver la app](https://medisyncsalta.vercel.app) · [📋 Reportar un bug](https://github.com/ocampososamariaagustina-tech/MediSync/issues)

</div>

---

## ¿Qué es MediSync?

MediSync es un intérprete de análisis clínicos para pacientes. Traduce resultados de laboratorio complejos a lenguaje ciudadano, visual y fácil de entender.

La mayoría de las IAs médicas están diseñadas para médicos. **MediSync es para el paciente** — enfocada en accesibilidad, empatía y reducción de la ansiedad.

---

## Funcionalidades principales

- 📄 **Carga de PDF o fotos** — subí tu análisis o fotografiá cada hoja
- 🤖 **Interpretación con IA** — Gemini lee cada biomarcador automáticamente
- 🚦 **Semáforo de bienestar** — verde, amarillo o rojo según el rango de referencia
- 💬 **Cards inteligentes** — explicación en lenguaje simple al tocar cada valor
- 📊 **Agrupado por categoría** — hemograma, bioquímica, función renal, hepática, orina
- 👨‍⚕️ **Mini doc** — conversación de bienvenida que personaliza la experiencia
- 💡 **Consejos de salud** — carrusel con fuentes del Ministerio de Salud Argentina
- 🔒 **Privacidad** — ningún dato se almacena, todo se procesa en el momento

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React + Vite |
| Backend | Python + FastAPI |
| IA | Google Gemini 2.0 Flash |
| OCR | PyMuPDF |
| Deploy frontend | Vercel |
| Deploy backend | Railway |

---

## Estructura del proyecto

```
MediSync/
├── frontend/          # App React
│   ├── src/
│   │   ├── components/
│   │   │   ├── AvisoPrivacidad.jsx
│   │   │   ├── BioCard.jsx
│   │   │   ├── Consejos.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── MiniDoc.jsx
│   │   │   ├── PacienteCard.jsx
│   │   │   ├── Resultados.jsx
│   │   │   └── UploadZone.jsx
│   │   ├── App.jsx
│   │   └── index.css
│   └── public/
│       └── favicon.svg
└── backend/           # API Python
    ├── main.py
    ├── parser.py
    ├── prompt.py
    ├── mock.json
    └── requirements.txt
```

---

## Instalación local

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate       # Windows
source venv/bin/activate    # Mac/Linux
pip install -r requirements.txt
```

Creá un archivo `.env` en la carpeta `backend/`:

```
IA_PROVIDER=gemini
GEMINI_API_KEY=tu-clave-aqui
FRONTEND_URL=http://localhost:5173
MAX_SIZE_MB=10
```

Levantá el servidor:

```bash
python -m uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
```

Creá un archivo `.env` en la carpeta `frontend/`:

```
VITE_API_URL=http://localhost:8000
```

Levantá la app:

```bash
npm run dev
```

Abrí `http://localhost:5173` en el navegador.

---

## Variables de entorno

### Backend (Railway)

| Variable | Descripción |
|---|---|
| `IA_PROVIDER` | `gemini`, `openai` o `claude` |
| `GEMINI_API_KEY` | Clave de Google AI Studio |
| `OPENAI_API_KEY` | Clave de OpenAI (opcional) |
| `ANTHROPIC_API_KEY` | Clave de Anthropic (opcional) |
| `FRONTEND_URL` | URL del frontend en Vercel |
| `MAX_SIZE_MB` | Tamaño máximo de archivo (default: 10) |

### Frontend (Vercel)

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL del backend en Railway |

---

## Límites éticos

MediSync está diseñado con límites éticos estrictos:

- ✅ Informa qué significa cada valor y si está fuera de rango
- ✅ Explica en lenguaje simple sin tecnicismos
- ✅ Siempre deriva al médico para interpretación clínica
- ❌ Nunca diagnostica enfermedades
- ❌ Nunca recomienda medicamentos ni tratamientos
- ❌ Nunca contradice al médico tratante
- ❌ Nunca usa lenguaje alarmista

---

## Fuentes de los consejos de salud

Todos los consejos del carrusel provienen del **Ministerio de Salud de la Nación Argentina**:

- [Alimentación saludable](https://www.argentina.gob.ar/salud/alimentacion-saludable)
- [Actividad física](https://www.argentina.gob.ar/salud/actividad-fisica)

---

## Equipo

Desarrollado para hackathon por el equipo **MediSync Salta** 🏔️

---

<div align="center">

<img src="frontend/src/assets/medisync-favicon.svg" width="40" alt="MediSync icon"/>

*MediSync — Entiende tu salud, tomá el control.*

</div>
