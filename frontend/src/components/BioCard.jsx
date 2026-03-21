import { useState } from 'react'

const COLORES = {
  normal:   { marcador: '#06b600', bg: '#e8f5e9', text: '#00d346', emoji: '✓', label: 'Normal',       franja: null },
  alto:     { marcador: '#E24B4A', bg: '#FCEBEB', text: '#791F1F', emoji: '↑', label: 'Elevado',      franja: 'Tu valor está por encima del rango normal' },
  bajo:     { marcador: '#ffd000', bg: '#FAEEDA', text: '#633806', emoji: '↓', label: 'Bajo',          franja: 'Tu valor está por debajo del rango normal' },
  muy_alto: { marcador: '#E24B4A', bg: '#FCEBEB', text: '#791F1F', emoji: '↑↑', label: 'Muy elevado', franja: 'Tu valor está muy por encima del rango normal' },
  muy_bajo: { marcador: '#EF9F27', bg: '#FAEEDA', text: '#633806', emoji: '↓↓', label: 'Muy bajo',    franja: 'Tu valor está muy por debajo del rango normal' },
}

function BarraNum({ bio, c }) {
  const rango  = bio.rango_maximo - bio.rango_minimo
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

  const pctZonaL  = Math.max(2,  (bio.rango_minimo - escMin) / escala * 100)
  const pctZonaR  = Math.min(98, (bio.rango_maximo - escMin) / escala * 100)
  const pctZonaW  = pctZonaR - pctZonaL
  const pctValor  = Math.min(98, Math.max(2, (bio.valor - escMin) / escala * 100))
  const esFuera   = bio.estado !== 'normal'

  return (
    <div style={{ marginTop: '10px', marginBottom: '4px' }}>
      <div style={{ position: 'relative', height: '12px', background: '#eef0f5', borderRadius: '6px', marginBottom: '28px' }}>

        <div style={{
          position: 'absolute', top: 0, height: '100%',
          left: `${pctZonaL}%`, width: `${pctZonaW}%`,
          background: 'rgba(184, 247, 241, 0.18)',
          border: '1px solid rgba(136, 167, 151, 0.4)',
          borderRadius: '4px',
        }} />

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

        <div style={{
          position: 'absolute', top: '20px',
          left: `${pctZonaL}%`,
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px',
        }}>
          <span style={{ fontSize: '11px', fontWeight: '600', color: '#1D9E75', whiteSpace: 'nowrap' }}>{bio.rango_minimo}</span>
          <span style={{ fontSize: '9px', color: '#1D9E75', opacity: 0.8, whiteSpace: 'nowrap' }}>mín normal</span>
        </div>

        <div style={{
          position: 'absolute', top: '20px',
          left: `${pctValor}%`,
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px',
          zIndex: 1,
        }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: c.marcador, whiteSpace: 'nowrap' }}>{bio.valor}</span>
          <span style={{ fontSize: '9px', color: c.marcador, opacity: 0.8, whiteSpace: 'nowrap' }}>mi valor</span>
        </div>

        <div style={{
          position: 'absolute', top: '20px',
          left: `${pctZonaR}%`,
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px',
        }}>
          <span style={{ fontSize: '11px', fontWeight: '600', color: '#1D9E75', whiteSpace: 'nowrap' }}>{bio.rango_maximo}</span>
          <span style={{ fontSize: '9px', color: '#1D9E75', opacity: 0.8, whiteSpace: 'nowrap' }}>máx normal</span>
        </div>

      </div>

      {esFuera && c.franja && (
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