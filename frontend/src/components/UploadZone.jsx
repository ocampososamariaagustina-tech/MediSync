import { useState } from 'react'

const styles = {
  zone: {
    border: '2px dashed #1a2f6b',
    borderRadius: '16px',
    padding: '48px 24px',
    textAlign: 'center',
    cursor: 'pointer',
    background: '#fff',
    transition: 'all 0.2s',
    marginBottom: '16px',
  },
  zoneHover: {
    background: '#e8ecf5',
    borderColor: '#0f1f4a',
  },
  icon: {
    fontSize: '40px',
    marginBottom: '12px',
  },
  title: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: '6px',
  },
  sub: {
    fontSize: '13px',
    color: '#888',
    marginBottom: '20px',
  },
  btn: {
    background: '#1a2f6b',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 24px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    marginTop: '8px',
  },
  fileName: {
    fontSize: '13px',
    color: '#1a2f6b',
    marginTop: '10px',
    fontWeight: '500',
  },
}

const PASOS = [
  'Leyendo tu análisis...',
  'Identificando valores...',
  'Generando tu resumen...',
]

export default function UploadZone({ onResultado }) {
  const [hover, setHover]         = useState(false)
  const [archivos, setArchivos]   = useState([])
  const [cargando, setCargando]   = useState(false)
  const [pasoActual, setPasoActual] = useState(0)
  const [error, setError]         = useState(null)

  const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  function seleccionarArchivo(e) {
    const files = Array.from(e.target.files)
    if (files.length) {
      setArchivos(files)
      setError(null)
    }
  }

  async function analizar() {
    if (!archivos.length) return
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
      archivos.forEach(f => formData.append('archivos', f))

      const res  = await fetch(`${API}/analizar`, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.detail || 'Error al analizar el archivo')

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
        <div style={styles.sub}>
          PDF o fotos del análisis — podés subir varias hojas a la vez
        </div>
        <input
          type="file"
          accept=".pdf,image/*"
          multiple
          style={{ display: 'none' }}
          onChange={seleccionarArchivo}
        />
        <div style={{
          background: '#1a2f6b',
          color: '#fff',
          borderRadius: '8px',
          padding: '10px 24px',
          fontSize: '14px',
          fontWeight: '600',
          display: 'inline-block',
        }}>
          Elegir archivo
        </div>

        {archivos.length > 0 && (
          <div style={styles.fileName}>
            📎 {archivos.length === 1
              ? archivos[0].name
              : `${archivos.length} archivos seleccionados`
            }
          </div>
        )}
      </label>

      {cargando && (
        <div style={{ margin: '16px 0' }}>
          <div style={{
            height: '4px',
            background: '#e0e6f0',
            borderRadius: '2px',
            overflow: 'hidden',
            marginBottom: '14px',
          }}>
            <div style={{
              height: '100%',
              borderRadius: '2px',
              background: '#1a2f6b',
              width: pasoActual === 0 ? '20%' : pasoActual === 1 ? '60%' : '85%',
              transition: 'width 1s ease',
            }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {PASOS.map((paso, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                opacity: i <= pasoActual ? 1 : 0.3,
                transition: 'opacity .4s',
              }}>
                <div style={{
                  width: '20px', height: '20px',
                  borderRadius: '50%',
                  background: i < pasoActual
                    ? '#1D9E75'
                    : i === pasoActual
                      ? '#1a2f6b'
                      : '#e0e6f0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px', color: '#fff', fontWeight: '700',
                  flexShrink: 0, transition: 'background .4s',
                }}>
                  {i < pasoActual ? '✓' : i + 1}
                </div>
                <span style={{
                  fontSize: '13px',
                  color: i === pasoActual ? '#1a2f6b' : '#888',
                  fontWeight: i === pasoActual ? '600' : '400',
                  transition: 'color .4s',
                }}>
                  {paso}
                </span>
                {i === pasoActual && (
                  <div style={{ display: 'flex', gap: '3px', marginLeft: 'auto' }}>
                    {[0, 1, 2].map(j => (
                      <div key={j} style={{
                        width: '4px', height: '4px',
                        borderRadius: '50%',
                        background: '#1a2f6b',
                        opacity: 0.4,
                        animation: `pulse 1.2s ease-in-out ${j * 0.2}s infinite`,
                      }} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
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

      {archivos.length > 0 && !cargando && (
        <button style={styles.btn} onClick={analizar}>
          Analizar mi estudio
        </button>
      )}
    </div>
  )
}