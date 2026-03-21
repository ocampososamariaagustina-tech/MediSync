{/*const colores = {
  normal:   { bg: '#E1F5EE', border: '#1D9E75', text: '#085041', label: 'Normal' },
  alto:     { bg: '#FCEBEB', border: '#E24B4A', text: '#791F1F', label: 'Elevado' },
  bajo:     { bg: '#FAEEDA', border: '#EF9F27', text: '#633806', label: 'Bajo' },
  muy_alto: { bg: '#FCEBEB', border: '#E24B4A', text: '#791F1F', label: 'Muy elevado' },
  muy_bajo: { bg: '#FAEEDA', border: '#EF9F27', text: '#633806', label: 'Muy bajo' },
}

export default function CardInteligente({ bio, onCerrar }) {
  const c = colores[bio.estado] || colores.normal

  const pct = Math.min(100, Math.max(0,
    (bio.valor - bio.rango_minimo) /
    (bio.rango_maximo - bio.rango_minimo) * 100
  ))

  const refPct = 100

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.45)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      zIndex: 100,
    }}
      onClick={onCerrar}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '400px',
          width: '100%',
          border: `2px solid ${c.border}`,
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a' }}>
              {bio.nombre_simple}
            </div>
            <span style={{
              display: 'inline-block',
              background: c.bg,
              color: c.text,
              border: `1px solid ${c.border}`,
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: '600',
              padding: '2px 10px',
              marginTop: '4px',
            }}>
              {c.label}
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: c.text }}>
              {bio.valor}
            </div>
            <div style={{ fontSize: '12px', color: '#888' }}>{bio.unidad}</div>
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <div style={{
            height: '8px',
            background: '#eee',
            borderRadius: '4px',
            position: 'relative',
            marginBottom: '4px',
          }}>
            <div style={{
              position: 'absolute',
              left: 0, top: 0,
              height: '100%',
              width: `${refPct}%`,
              background: '#E1F5EE',
              borderRadius: '4px',
            }} />
            <div style={{
              position: 'absolute',
              left: 0, top: 0,
              height: '100%',
              width: `${Math.min(pct, 100)}%`,
              background: c.border,
              borderRadius: '4px',
              transition: 'width 0.5s',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#aaa' }}>
            <span>{bio.rango_minimo}</span>
            <span>Rango normal: {bio.rango_minimo}–{bio.rango_maximo} {bio.unidad}</span>
            <span>{bio.rango_maximo}</span>
          </div>
        </div>

        <div style={{
          background: '#f8f9fa',
          borderRadius: '10px',
          padding: '12px 14px',
          fontSize: '13px',
          color: '#333',
          lineHeight: '1.6',
          marginBottom: '12px',
        }}>
          {bio.explicacion_ciudadana}
        </div>

        <div style={{
          background: c.bg,
          borderRadius: '10px',
          padding: '10px 14px',
          fontSize: '12px',
          color: c.text,
          lineHeight: '1.5',
          marginBottom: '12px',
        }}>
          💡 {bio.consejo_general}
        </div>

        <div style={{
          fontSize: '11px',
          color: '#aaa',
          textAlign: 'center',
          lineHeight: '1.5',
        }}>
          {bio.disclaimer}
        </div>

        <button
          onClick={onCerrar}
          style={{
            width: '100%',
            marginTop: '16px',
            background: '#1a1a1a',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '10px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Cerrar
        </button>
      </div>
    </div>
  )
}
*/}