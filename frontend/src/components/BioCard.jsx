import { useState } from 'react'

const COLORES = {
  normal:   { marcador: '#1a2f6b', bg: '#e8ecf5', text: '#1a2f6b', emoji: '✓', label: 'Normal',       franja: null },
  alto:     { marcador: '#E24B4A', bg: '#FCEBEB', text: '#791F1F', emoji: '↑', label: 'Elevado',      franja: 'Tu valor está por encima del rango normal' },
  bajo:     { marcador: '#EF9F27', bg: '#FAEEDA', text: '#633806', emoji: '↓', label: 'Bajo',          franja: 'Tu valor está por debajo del rango normal' },
  muy_alto: { marcador: '#E24B4A', bg: '#FCEBEB', text: '#791F1F', emoji: '↑↑', label: 'Muy elevado', franja: 'Tu valor está muy por encima del rango normal' },
  muy_bajo: { marcador: '#EF9F27', bg: '#FAEEDA', text: '#633806', emoji: '↓↓', label: 'Muy bajo',    franja: 'Tu valor está muy por debajo del rango normal' },
}

const UMBRAL_OVERLAP = 15 // % mínimo de separación entre etiquetas

function Etiqueta({ pct, valor, sublabel, color, apilada, abajo }) {
  return (
    <div style={{
      position: 'absolute',
      left: `${pct}%`,
      top: apilada && abajo ? '28px' : '0px',
      transform: 'translateX(-50%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      transition: 'top .2s',
    }}>
      <span style={{ fontSize: '11px', fontWeight: '600', color, whiteSpace: 'nowrap' }}>
        {valor}
      </span>
      <span style={{ fontSize: '9px', color, opacity: 0.8, whiteSpace: 'nowrap' }}>
        {sublabel}
      </span>
    </div>
  )
}

function BarraNum({ bio, c }) {
  const rango = bio.rango_maximo - bio.rango_minimo
  const esZero = rango === 0

  if (esZero) {
    return (
      <div style={{ marginTop: '8px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '8px 12px', borderRadius: '8px', background: c.bg,
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: c.marcador, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: c.text }}>
              Valor: {bio.valor} {bio.unidad}
            </div>
            <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
              Rango esperado: {bio.rango_minimo} - {bio.rango_maximo} {bio.unidad}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const margen  = rango * 0.5
  const escMin  = Math.max(0, bio.rango_minimo - margen)
  const escMax  = bio.rango_maximo + margen
  const escala  = escMax - escMin

  const pctMin   = Math.max(2,  (bio.rango_minimo - escMin) / escala * 100)
  const pctMax   = Math.min(98, (bio.rango_maximo - escMin) / escala * 100)
  const pctZonaW = pctMax - pctMin
  const pctValor = Math.min(98, Math.max(2, (bio.valor - escMin) / escala * 100))
  const esFuera  = bio.estado !== 'normal'
  const esBajo   = bio.estado === 'bajo' || bio.estado === 'muy_bajo'

  // Detectar superposición entre etiquetas
  // El valor puede estar cerca del mín o del máx
  const cercaDeMin = Math.abs(pctValor - pctMin) < UMBRAL_OVERLAP
  const cercaDeMax = Math.abs(pctValor - pctMax) < UMBRAL_OVERLAP
  const hayOverlap = cercaDeMin || cercaDeMax

  // Altura del área de etiquetas
  const alturaLabels = hayOverlap ? 60 : 36

  return (
    <div style={{ marginTop: '10px' }}>

      {/* Barra */}
      <div style={{
        position: 'relative',
        height: '12px',
        background: '#eef0f5',
        borderRadius: '6px',
        marginBottom: '8px',
      }}>
        {/* Zona normal verde */}
        <div style={{
          position: 'absolute', top: 0, height: '100%',
          left: `${pctMin}%`, width: `${pctZonaW}%`,
          background: 'rgba(29,158,117,0.18)',
          border: '1px solid rgba(29,158,117,0.4)',
          borderRadius: '4px',
        }} />

        {/* Marcador del valor */}
        <div style={{
          position: 'absolute', top: '-4px',
          left: `${pctValor}%`,
          transform: 'translateX(-50%)',
          width: '4px', height: '20px',
          background: c.marcador,
          borderRadius: '3px',
          boxShadow: `0 0 0 3px rgba(255,255,255,0.9), 0 0 0 4px ${c.marcador}44`,
          zIndex: 2,
        }} />
      </div>

      {/* Área de etiquetas */}
      <div style={{ position: 'relative', height: `${alturaLabels}px`, marginBottom: '4px' }}>

        {/* Mín normal */}
        <Etiqueta
          pct={pctMin}
          valor={bio.rango_minimo}
          sublabel="mín normal"
          color="#1D9E75"
          apilada={hayOverlap && cercaDeMin}
          abajo={false}
        />

        {/* Valor del paciente */}
        <Etiqueta
          pct={pctValor}
          valor={bio.valor}
          sublabel="mi valor"
          color={c.marcador}
          apilada={hayOverlap}
          abajo={true}
        />

        {/* Máx normal */}
        <Etiqueta
          pct={pctMax}
          valor={bio.rango_maximo}
          sublabel="máx normal"
          color="#1D9E75"
          apilada={hayOverlap && cercaDeMax}
          abajo={false}
        />

      </div>

      {/* Franja contextual si está fuera de rango */}
      {esFuera && c.franja && (
        <div style={{
          background: c.bg,
          borderRadius: '8px',
          padding: '7px 12px',
          fontSize: '12px',
          color: c.text,
          marginTop: '6px',
        }}>
          {c.franja}
        </div>
      )}

    </div>
  )
}

function BadgeTxt({ bio, c }) {
  return (
    <div style={{ marginTop: '8px' }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        padding: '6px 12px', borderRadius: '8px', background: c.bg,
      }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: c.marcador, flexShrink: 0 }} />
        <span style={{ fontSize: '13px', fontWeight: '600', color: c.text }}>{String(bio.valor)}</span>
      </div>
      {bio.valor_esperado && (
        <div style={{ fontSize: '11px', color: '#aaa', marginTop: '5px' }}>
          Lo esperado: {bio.valor_esperado}
        </div>
      )}
      {c.franja && (
        <div style={{
          background: c.bg, borderRadius: '8px',
          padding: '7px 12px', fontSize: '12px',
          color: c.text, marginTop: '8px',
        }}>
          {c.franja}
        </div>
      )}
    </div>
  )
}

export default function BioCard({ bio }) {
  const [abierto, setAbierto] = useState(false)
  const c     = COLORES[bio.estado] || COLORES.normal
  const esNum = typeof bio.valor === 'number' && !isNaN(bio.valor)
  const esAlt = bio.estado !== 'normal'

  return (
    <div
      onClick={() => setAbierto(a => !a)}
      style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '14px 16px',
        marginBottom: '6px',
        border: `${esAlt ? '1.5px' : '0.5px'} solid ${esAlt ? c.marcador + '44' : '#e8edf5'}`,
        cursor: 'pointer',
        transition: 'box-shadow .15s',
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.07)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ fontSize: '13px', fontWeight: '500', color: '#1a1a2e', flex: 1 }}>
          {bio.nombre_simple}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          {esNum && (
            <span style={{ fontSize: '15px', fontWeight: '700', color: c.marcador }}>
              {bio.valor}{' '}
              <span style={{ fontSize: '11px', fontWeight: '400', color: '#aaa' }}>{bio.unidad}</span>
            </span>
          )}
          <span style={{
            background: c.bg, color: c.text,
            borderRadius: '20px', fontSize: '11px', fontWeight: '700',
            padding: '3px 10px',
          }}>
            {c.emoji} {c.label}
          </span>
          <span style={{
            fontSize: '14px', color: '#ccc',
            transition: 'transform .2s',
            transform: abierto ? 'rotate(90deg)' : 'none',
            display: 'inline-block',
          }}>›</span>
        </div>
      </div>

      {esNum ? <BarraNum bio={bio} c={c} /> : <BadgeTxt bio={bio} c={c} />}

      {!abierto && (
        <div style={{ fontSize: '11px', color: '#ccc', textAlign: 'right', marginTop: '8px' }}>
          Tocá para entender qué significa →
        </div>
      )}

      {abierto && (
        <div style={{ marginTop: '14px', borderTop: '0.5px solid #f0f4f8', paddingTop: '14px' }}>
          <div style={{ fontSize: '13px', color: '#444', lineHeight: '1.65', marginBottom: '10px' }}>
            {bio.explicacion_ciudadana}
          </div>
          <div style={{
            background: c.bg, borderRadius: '10px',
            padding: '10px 12px', fontSize: '12px',
            color: c.text, marginBottom: '10px', lineHeight: '1.5',
          }}>
            💡 {bio.consejo_general}
          </div>
          <div style={{ fontSize: '11px', color: '#bbb', textAlign: 'center', lineHeight: '1.5' }}>
            {bio.disclaimer}
          </div>
        </div>
      )}
    </div>
  )
}