export default function AvisoPrivacidad({ aceptado, onAceptar, onCancelar }) {

  if (aceptado) {
    return (
      <div style={{
        background: '#EAF3DE',
        border: '0.5px solid #97C459',
        borderRadius: '14px',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '12px',
        color: '#27500A',
        marginBottom: '12px',
      }}>
        <span style={{ fontSize: '16px' }}>✓</span>
        <span style={{ flex: 1 }}>Privacidad aceptada — podés subir tu análisis</span>
        <span
          onClick={onCancelar}
          style={{
            fontSize: '11px',
            color: '#3B6D11',
            cursor: 'pointer',
            textDecoration: 'underline',
            flexShrink: 0,
          }}
        >
          Revocar
        </span>
      </div>
    )
  }

  return (
    <div style={{
      background: '#fff',
      border: '0.5px solid #d0d8e8',
      borderRadius: '14px',
      padding: '14px 16px',
      marginBottom: '12px',
      transition: 'border-color .3s, background .3s',
    }}
      id="aviso-banner"
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
        <div style={{
          width: '32px', height: '32px',
          borderRadius: '8px',
          background: '#E6F1FB',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '16px', flexShrink: 0,
        }}>
          🔒
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a2e', marginBottom: '3px' }}>
            Antes de continuar — cómo usamos tu información
          </div>
          <div style={{ fontSize: '12px', color: '#888', lineHeight: '1.5' }}>
            Leé esto antes de subir tu análisis clínico
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '14px' }}>
        {[
          { color: '#1a2f6b', texto: 'Tu análisis se procesa con inteligencia artificial de Google (Gemini) para interpretar los valores.' },
          { color: '#1D9E75', texto: 'No almacenamos tu PDF ni tus datos personales. Todo se procesa en el momento y se descarta.' },
          { color: '#1D9E75', texto: 'MediSync es una herramienta informativa. No reemplaza la consulta con tu médico.' },
          { color: '#EF9F27', texto: 'Al aceptar, confirmás que leíste esto y que el análisis te pertenece o tenés autorización para subirlo.' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: '#555', lineHeight: '1.5' }}>
            <div style={{
              width: '6px', height: '6px',
              borderRadius: '50%',
              background: item.color,
              flexShrink: 0,
              marginTop: '5px',
            }} />
            {item.texto}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={onCancelar}
          style={{
            flex: 1,
            background: 'transparent',
            border: '1px solid #d0d8e8',
            borderRadius: '8px',
            padding: '9px',
            fontSize: '13px',
            color: '#888',
            cursor: 'pointer',
          }}
        >
          No acepto
        </button>
        <button
          onClick={onAceptar}
          style={{
            flex: 2,
            background: '#1a2f6b',
            border: 'none',
            borderRadius: '8px',
            padding: '9px',
            fontSize: '13px',
            fontWeight: '600',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Entendido, continuar →
        </button>
      </div>
    </div>
  )
}