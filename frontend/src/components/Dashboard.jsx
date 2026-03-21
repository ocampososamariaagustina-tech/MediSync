export default function Dashboard({ datos }) {
  const total    = datos.biomarcadores.length
  const normales = datos.biomarcadores.filter(b => b.estado === 'normal').length
  const atencion = datos.biomarcadores.filter(b => b.estado !== 'normal')

  return (
    <div style={{
      background: '#fff',
      borderRadius: '14px',
      padding: '16px',
      border: '0.5px solid #e0e6f0',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '8px',
        marginBottom: '16px',
      }}>
        {[
          { v: total,    l: 'Total analizado',    c: '#1a2f6b' },
          { v: normales, l: 'En rango normal',    c: '#1D9E75' },
          { v: atencion.length, l: 'Con atención', c: atencion.length > 0 ? '#E24B4A' : '#1D9E75' },
        ].map((k, i) => (
          <div key={i} style={{
            background: '#f0f4f8',
            borderRadius: '10px',
            padding: '10px 12px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: k.c }}>{k.v}</div>
            <div style={{ fontSize: '10px', color: '#888', marginTop: '2px' }}>{k.l}</div>
          </div>
        ))}
      </div>

      {atencion.length > 0 && (
        <>
          <div style={{ fontSize: '10px', fontWeight: '700', color: '#aaa', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '8px' }}>
            Valores a revisar
          </div>
          {atencion.map((bio, i) => {
            const esAlto = bio.estado === 'alto' || bio.estado === 'muy_alto'
            const color  = esAlto
              ? { bg: '#FCEBEB', text: '#791F1F', dot: '#E24B4A', pill: '#A32D2D', label: '↑ Alto' }
              : { bg: '#FAEEDA', text: '#633806', dot: '#EF9F27', pill: '#854F0B', label: '↓ Bajo' }

            return (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 10px',
                borderRadius: '8px',
                background: color.bg,
                marginBottom: '6px',
              }}>
                <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: color.dot, flexShrink: 0 }} />
                <div style={{ fontSize: '13px', fontWeight: '500', color: color.text, flex: 1 }}>
                  {bio.nombre_simple}
                </div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: color.pill }}>
                  {typeof bio.valor === 'number' ? bio.valor : String(bio.valor)} {typeof bio.valor === 'number' ? bio.unidad : ''}
                </div>
                <span style={{
                  background: '#fff',
                  color: color.pill,
                  borderRadius: '20px',
                  fontSize: '10px',
                  fontWeight: '600',
                  padding: '2px 8px',
                }}>
                  {color.label}
                </span>
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}