export default function PacienteCard({ datos }) {
  const grupoSanguineo = datos.grupo_sanguineo || null
  const factorRh       = datos.factor_rh       || null
  const nombre         = datos.nombre_paciente  || null
  const fecha          = datos.fecha_analisis   || null

  if (!grupoSanguineo && !factorRh && !nombre && !fecha) return null

  const iniciales = nombre
    ? nombre.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
    : '?'

  return (
    <div style={{
      background: '#fff',
      borderRadius: '14px',
      padding: '14px 16px',
      marginBottom: '14px',
      border: '0.5px solid #e0e6f0',
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
    }}>
      <div style={{
        width: '44px', height: '44px',
        borderRadius: '50%',
        background: '#1a2f6b',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '14px', fontWeight: '700', color: '#fff',
        flexShrink: 0,
      }}>
        {iniciales}
      </div>

      <div style={{ flex: 1 }}>
        {nombre && (
          <div style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a2e' }}>
            {nombre}
          </div>
        )}
        {fecha && (
          <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
            Análisis · {fecha}
          </div>
        )}
        {!nombre && !fecha && (
          <div style={{ fontSize: '13px', color: '#888' }}>Datos del análisis</div>
        )}
      </div>

      {(grupoSanguineo || factorRh) && (
        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          {grupoSanguineo && (
            <div style={{
              background: '#f0f4f8',
              border: '1px solid #d0d8e8',
              borderRadius: '20px',
              padding: '5px 12px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '9px', color: '#888', fontWeight: '400' }}>Grupo</div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a2f6b' }}>
                {grupoSanguineo}
              </div>
            </div>
          )}
          {factorRh && (
            <div style={{
              background: '#f0f4f8',
              border: '1px solid #d0d8e8',
              borderRadius: '20px',
              padding: '5px 12px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '9px', color: '#888', fontWeight: '400' }}>Factor</div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a2f6b' }}>
                {factorRh}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}