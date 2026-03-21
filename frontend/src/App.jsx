import { useState } from 'react'
import UploadZone from './components/UploadZone'
import Resultados from './components/Resultados'

export default function App() {
  const [resultado, setResultado] = useState(null)

  return (
    <div className="app">
      <div className="app-header">
        <div className="logo-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"
              fill="rgba(255,255,255,0.95)"/>
            <path d="M9 12l2 2 4-4" stroke="#1a2f6b" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <div className="app-logo">MediSync</div>
          <div className="app-slogan">Understand your health</div>
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