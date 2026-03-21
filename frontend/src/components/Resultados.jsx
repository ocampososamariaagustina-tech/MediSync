import PacienteCard from './PacienteCard'
import Dashboard    from './Dashboard'
import BioCard      from './BioCard'

const LABEL = {
  color: '#aaa',
  fontSize: '10px',
  fontWeight: '700',
  letterSpacing: '.07em',
  textTransform: 'uppercase',
  margin: '20px 0 8px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
}

const LINE = {
  flex: 1,
  height: '1px',
  background: '#e8edf5',
}

function Seccion({ numero, titulo }) {
  return (
    <div style={LABEL}>
      <span>{numero} — {titulo}</span>
      <div style={LINE} />
    </div>
  )
}

export default function Resultados({ datos, onReset }) {
  const alterados = datos.biomarcadores.filter(b => b.estado !== 'normal')

  return (
    <div>

      {/* BLOQUE 1 — Resumen empático */}
      <Seccion numero="1" titulo="Tu resumen" />
      <div style={{
        background: '#1a2f6b',
        borderRadius: '16px',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', bottom: '-15px', right: '-15px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: '-25px', right: '-25px', width: '140px', height: '140px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
          {datos.nombre_paciente ? `Hola, ${datos.nombre_paciente.split(' ')[0]} 👋` : 'Tus resultados 👋'}
        </div>
        <div style={{ fontSize: '15px', color: '#fff', lineHeight: '1.6', fontWeight: '500', marginBottom: '14px' }}>
          {datos.resumen_empatico}
        </div>
        {alterados.length > 0 && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.12)',
            borderRadius: '20px',
            padding: '5px 14px',
            fontSize: '12px',
            color: 'rgba(255,255,255,0.85)',
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF9F27' }} />
            {alterados.length} valor{alterados.length > 1 ? 'es' : ''} para revisar con tu médico
          </div>
        )}
      </div>

      {/* BLOQUE 2 — Datos del paciente */}
      {(datos.nombre_paciente || datos.grupo_sanguineo || datos.factor_rh) && (
        <>
          <Seccion numero="2" titulo="Tus datos" />
          <PacienteCard datos={datos} />
        </>
      )}

      {/* BLOQUE 3 — Dashboard resumen */}
      <Seccion numero="3" titulo="Resumen visual" />
      <Dashboard datos={datos} />

      {/* BLOQUE 4 — Detalle de cada biomarcador */}
      <Seccion numero="4" titulo="Detalle de cada valor" />
      {datos.biomarcadores.map((bio, i) => (
        <BioCard key={i} bio={bio} />
      ))}

      <button
        onClick={onReset}
        style={{
          width: '100%',
          marginTop: '20px',
          background: 'transparent',
          color: '#aaa',
          border: '1px solid #d0d8e8',
          borderRadius: '8px',
          padding: '10px',
          fontSize: '13px',
          cursor: 'pointer',
        }}
      >
        Analizar otro estudio
      </button>

    </div>
  )
}