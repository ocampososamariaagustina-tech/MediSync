import { useState } from 'react'

const styles = {
  zone: {
    border: '2px dashed #2a1d9e',
    borderRadius: '16px',
    padding: '48px 24px',
    textAlign: 'center',
    cursor: 'pointer',
    background: '#fff',
    transition: 'all 0.2s',
    marginBottom: '16px',
  },
  zoneHover: {
    background: '#E1F5EE',
    borderColor: '#180f6e',
  },
  icon: {
    fontSize: '40px',
    marginBottom: '12px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '6px',
  },
  sub: {
    fontSize: '15px',
    color: '#575454',
    marginBottom: '20px',
  },
  btn: {
    background: '#1a1c8a',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 24px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btnLoading: {
    background: '#a8a5a5',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 24px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'not-allowed',
  },
  fileName: {
    fontSize: '13px',
    color: '#0f386e',
    marginTop: '10px',
    fontWeight: '500',
  },
  steps: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    margin: '16px 0',
  },
  step: {
    fontSize: '13px',
    color: '#1d1f9e',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    justifyContent: 'center',
  }
}

const PASOS = [
  'Leyendo tu PDF...',
  'Identificando valores...',
  'Generando tu resumen...',
]

export default function UploadZone({ onResultado }) {
  const [hover, setHover]       = useState(false)
  const [archivo, setArchivo]   = useState(null)
  const [cargando, setCargando] = useState(false)
  const [pasoActual, setPasoActual] = useState(0)
  const [error, setError]       = useState(null)

  const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  function seleccionarArchivo(e) {
    const file = e.target.files[0]
    if (file) {
      setArchivo(file)
      setError(null)
    }
  }

  async function analizar() {
    if (!archivo) return
    setCargando(true)
    setError(null)
    setPasoActual(0)

    const intervalo = setInterval(() => {
      setPasoActual(prev => {
        if (prev < PASOS.length - 1) return prev + 1
        clearInterval(intervalo)
        return prev
      })
    }, 1500)

    try {
      const formData = new FormData()
      formData.append('archivo', archivo)

      const res = await fetch(`${API}/analizar`, {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || 'Error al analizar el PDF')
      }

      clearInterval(intervalo)
      onResultado(data)
    } catch (err) {
      clearInterval(intervalo)
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div>
      <label
        style={{ ...styles.zone, ...(hover ? styles.zoneHover : {}) }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div style={styles.icon}>📄</div>
        <div style={styles.title}>Subí tu análisis clínico</div>
        <div style={styles.sub}>PDF o imagen — en segundos lo traducimos para vos</div>
        <input
          type="file"
          accept=".pdf"
          style={{ display: 'none' }}
          onChange={seleccionarArchivo}
        />
        <div style={styles.btn}>Elegir archivo</div>
        {archivo && (
          <div style={styles.fileName}>📎 {archivo.name}</div>
        )}
      </label>

      {cargando && (
        <div style={styles.steps}>
          {PASOS.map((paso, i) => (
            <div key={i} style={{
              ...styles.step,
              opacity: i <= pasoActual ? 1 : 0.3,
              fontWeight: i === pasoActual ? '600' : '400',
            }}>
              {i < pasoActual ? '✓' : i === pasoActual ? '⟳' : '○'} {paso}
            </div>
          ))}
        </div>
      )}

      {error && (
        <div style={{
          background: '#FCEBEB',
          color: '#A32D2D',
          borderRadius: '8px',
          padding: '10px 14px',
          fontSize: '13px',
          marginBottom: '12px',
        }}>
          {error}
        </div>
      )}

      {archivo && !cargando && (
        <button
          style={styles.btn}
          onClick={analizar}
        >
          Analizar mi estudio
        </button>
      )}
    </div>
  )
}