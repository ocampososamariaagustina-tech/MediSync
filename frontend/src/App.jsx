import { useState } from 'react'
import UploadZone from './components/UploadZone'
import Resultados from './components/Resultados'

// Mantener el backend despierto haciendo ping cada 4 minutos
const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'
setInterval(() => {
  fetch(`${API}/ping`).catch(() => {})
}, 4 * 60 * 1000)
// Animación riseIn: cada elemento entra con delay escalonado
// El keyframe está definido en index.css
const anim = (delay) => ({
  animation: `riseIn 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}s both`
})

export default function App() {
  const [resultado, setResultado] = useState(null)

  return (
    <div className="app">
      <div className="app-header">

        {/* Ícono — entra primero */}
        <div className="logo-icon" style={anim(0)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"
              fill="rgba(255,255,255,0.95)"
            />
            <path
              d="M9 12l2 2 4-4"
              stroke="#1a2f6b"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div>
          {/* Título — entra 120ms después del ícono */}
          <div className="app-logo" style={anim(0.12)}>
            MediSync
          </div>

          {/* Slogan — entra 220ms después del ícono */}
          <div className="app-slogan" style={anim(0.22)}>
            Understand your health
          </div>
        </div>

      </div>

      <div className="app-body">
        {!resultado
          ? <UploadZone onResultado={setResultado} />
          : <Resultados datos={resultado} onReset={() => setResultado(null)} />
        }
      </div>
    </div>
  )
}