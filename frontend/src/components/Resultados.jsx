import PacienteCard from './PacienteCard'
import Dashboard    from './Dashboard'
import BioCard      from './BioCard'

const GRUPOS = [
  { key: 'hemograma',  label: 'Hemograma',       emoji: '🩸' },
  { key: 'bioquimica', label: 'Bioquímica',       emoji: '⚗️' },
  { key: 'renal',      label: 'Función renal',    emoji: '🫘' },
  { key: 'hepatica',   label: 'Función hepática', emoji: '🫀' },
  { key: 'orina',      label: 'Orina',            emoji: '🔬' },
  { key: 'otros',      label: 'Otros',            emoji: '📋' },
]

const LABEL_STYLE = {
  fontSize: '10px',
  fontWeight: '700',
  letterSpacing: '.07em',
  textTransform: 'uppercase',
  color: '#aaa',
  margin: '20px 0 8px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
}

const LINE_STYLE = {
  flex: 1,
  height: '1px',
  background: '#e8edf5',
}

function SecLabel({ numero, titulo }) {
  return (
    <div style={LABEL_STYLE}>
      <span>{numero} — {titulo}</span>
      <div style={LINE_STYLE} />
    </div>
  )
}

function GrupoHeader({ emoji, label, total, alterados }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 14px',
      background: '#fff',
      borderRadius: '10px',
      marginBottom: '6px',
      border: '0.5px solid #e0e6f0',
    }}>
      <span style={{ fontSize: '16px' }}>{emoji}</span>
      <span style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a2e', flex: 1 }}>
        {label}
      </span>
      <span style={{
        fontSize: '11px', fontWeight: '600',
        padding: '2px 10px', borderRadius: '20px',
        background: alterados > 0 ? '#FCEBEB' : '#e8ecf5',
        color: alterados > 0 ? '#791F1F' : '#1a2f6b',
      }}>
        {alterados > 0 ? `${alterados} con atención` : `${total} normal`}
      </span>
    </div>
  )
}

export default function Resultados({ datos, onReset }) {
  const alterados = datos.biomarcadores.filter(b => b.estado !== 'normal')

  return (
    <div>

      {/* BLOQUE 1 — Resumen empático */}
      <SecLabel numero="1" titulo="Tu resumen" />
      <div style={{
        background: '#1a2f6b',
        borderRadius: '16px',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', bottom: '-15px', right: '-15px',
          width: '100px', height: '100px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-25px', right: '-25px',
          width: '140px', height: '140px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.03)',
        }} />
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
          {datos.nombre_paciente
            ? `Hola, ${datos.nombre_paciente.split(' ')[0]} 👋`
            : 'Tus resultados 👋'
          }
        </div>
        <div style={{
          fontSize: '15px', color: '#fff',
          lineHeight: '1.6', fontWeight: '500',
          marginBottom: '14px',
        }}>
          {datos.resumen_empatico}
        </div>
        {alterados.length > 0 && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,255,255,0.12)', borderRadius: '20px',
            padding: '5px 14px', fontSize: '12px',
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
          <SecLabel numero="2" titulo="Tus datos" />
          <PacienteCard datos={datos} />
        </>
      )}

      {/* BLOQUE 3 — Dashboard resumen */}
      <SecLabel numero="3" titulo="Resumen visual" />
      <Dashboard datos={datos} />

      {/* BLOQUE 4 — Detalle agrupado por categoría */}
      <SecLabel numero="4" titulo="Detalle por tipo de análisis" />

      {GRUPOS.map(grupo => {
        const bios = datos.biomarcadores.filter(b =>
          (b.categoria || 'otros') === grupo.key
        )
        if (bios.length === 0) return null

        const altCount = bios.filter(b => b.estado !== 'normal').length

        return (
          <div key={grupo.key} style={{ marginBottom: '16px' }}>
            <GrupoHeader
              emoji={grupo.emoji}
              label={grupo.label}
              total={bios.length}
              alterados={altCount}
            />
            {bios.map((bio, i) => (
              <div key={i} style={{ paddingLeft: '8px' }}>
                <BioCard bio={bio} />
              </div>
            ))}
          </div>
        )
      })}

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