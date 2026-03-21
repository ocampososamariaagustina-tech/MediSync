import { useState } from 'react'

const COLORES = {
  normal:   { barra: '#1a2f6b', bg: '#e8ecf5', text: '#1a2f6b', emoji: '✓' },
  alto:     { barra: '#E24B4A', bg: '#FCEBEB', text: '#791F1F', emoji: '↑' },
  bajo:     { barra: '#EF9F27', bg: '#FAEEDA', text: '#633806', emoji: '↓' },
  muy_alto: { barra: '#E24B4A', bg: '#FCEBEB', text: '#791F1F', emoji: '↑↑' },
  muy_bajo: { barra: '#EF9F27', bg: '#FAEEDA', text: '#633806', emoji: '↓↓' },
}

function BarraNum({ bio, c }) {
  const rango    = (bio.rango_maximo - bio.rango_minimo) || 1
  const escMin   = bio.rango_minimo - rango * 0.3
  const escMax   = bio.rango_maximo + rango * 0.3
  const escala   = escMax - escMin
  const pctVal   = Math.min(97, Math.max(3,  (bio.valor  - escMin) / escala * 100))
  const pctZonaL = Math.max(0,              (bio.rango_minimo - escMin) / escala * 100)
  const pctZonaW = Math.min(100, (bio.rango_maximo - escMin) / escala * 100) - pctZonaL
  const pctAguja = Math.min(97, Math.max(3,  (bio.rango_maximo - escMin) / escala * 100))
  const fuera    = bio.estado !== 'normal'

  return (
    <div style={{ marginTop: '8px' }}>
      <div style={{ position: 'relative', height: '8px', background: '#f0f0f5', borderRadius: '4px', marginBottom: '4px' }}>
        <div style={{ position: 'absolute', top: 0, height: '100%', left: `${pctZonaL}%`, width: `${pctZonaW}%`, background: 'rgba(29,158,117,0.15)', borderRadius: '3px' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${pctVal}%`, background: c.barra, borderRadius: '4px', opacity: 0.85, transition: 'width .6s ease' }} />
        {fuera && (
          <div style={{ position: 'absolute', top: '-3px', left: `${pctAguja}%`, width: '3px', height: '14px', background: '#1D9E75', borderRadius: '2px', transform: 'translateX(-50%)' }} />
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#bbb' }}>
        <span>{bio.rango_minimo}</span>
        {fuera && <span style={{ color: '#1D9E75', fontSize: '9px' }}>▲ normal hasta {bio.rango_maximo}</span>}
        <span>{bio.rango_maximo}</span>
      </div>
    </div>
  )
}

function BadgeTxt({ bio, c }) {
  return (
    <div style={{ marginTop: '8px' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 10px', borderRadius: '8px', background: c.bg }}>
        <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: c.barra, flexShrink: 0 }} />
        <span style={{ fontSize: '12px', fontWeight: '600', color: c.text }}>{String(bio.valor)}</span>
      </div>
      {bio.valor_esperado && (
        <div style={{ fontSize: '11px', color: '#bbb', marginTop: '4px' }}>Lo esperado: {bio.valor_esperado}</div>
      )}
    </div>
  )
}

export default function BioCard({ bio }) {
  const [abierto, setAbierto] = useState(false)
  const c       = COLORES[bio.estado] || COLORES.normal
  const esNum   = typeof bio.valor === 'number' && !isNaN(bio.valor)
  const esAlter = bio.estado !== 'normal'

  return (
    <div
      onClick={() => setAbierto(a => !a)}
      style={{
        background: '#fff',
        borderRadius: '10px',
        padding: '12px 14px',
        marginBottom: '6px',
        border: `${esAlter ? '1px' : '0.5px'} solid ${esAlter ? c.barra + '55' : '#e8edf5'}`,
        cursor: 'pointer',
        transition: 'box-shadow .15s',
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ fontSize: '13px', fontWeight: '500', color: '#1a1a2e' }}>
          {bio.nombre_simple}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {esNum && (
            <span style={{ fontSize: '14px', fontWeight: '700', color: c.text }}>
              {bio.valor}{' '}
              <span style={{ fontSize: '11px', fontWeight: '400', color: '#aaa' }}>{bio.unidad}</span>
            </span>
          )}
          <span style={{ background: c.bg, color: c.text, borderRadius: '20px', fontSize: '10px', fontWeight: '600', padding: '2px 8px' }}>
            {c.emoji}
          </span>
          <span style={{ fontSize: '12px', color: '#ccc', transition: 'transform .2s', transform: abierto ? 'rotate(90deg)' : 'none' }}>›</span>
        </div>
      </div>

      {esNum
        ? <BarraNum bio={bio} c={c} />
        : <BadgeTxt bio={bio} c={c} />
      }

      {!abierto && (
        <div style={{ fontSize: '11px', color: '#ccc', textAlign: 'right', marginTop: '4px' }}>
          Tocá para entender qué significa →
        </div>
      )}

      {abierto && (
        <div style={{ marginTop: '12px', borderTop: '0.5px solid #f0f0f5', paddingTop: '12px' }}>
          <div style={{ fontSize: '13px', color: '#333', lineHeight: '1.6', marginBottom: '10px' }}>
            {bio.explicacion_ciudadana}
          </div>
          <div style={{ background: c.bg, borderRadius: '8px', padding: '8px 10px', fontSize: '12px', color: c.text, marginBottom: '8px' }}>
            💡 {bio.consejo_general}
          </div>
          <div style={{ fontSize: '11px', color: '#bbb', textAlign: 'center' }}>
            {bio.disclaimer}
          </div>
        </div>
      )}
    </div>
  )
}