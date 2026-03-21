{/*import { useState } from 'react'
import CardInteligente from './CardInteligente'

const colores = {
  normal:   { barra: '#1D9E75', bg: '#E1F5EE', text: '#085041', emoji: '✓' },
  alto:     { barra: '#E24B4A', bg: '#FCEBEB', text: '#791F1F', emoji: '↑' },
  bajo:     { barra: '#EF9F27', bg: '#FAEEDA', text: '#633806', emoji: '↓' },
  muy_alto: { barra: '#E24B4A', bg: '#FCEBEB', text: '#791F1F', emoji: '↑↑' },
  muy_bajo: { barra: '#EF9F27', bg: '#FAEEDA', text: '#633806', emoji: '↓↓' },
}

function BarraBio({ bio, onClick }) {
  const c = colores[bio.estado] || colores.normal

  const pct = Math.min(100, Math.max(5,
    (bio.valor - bio.rango_minimo) /
    ((bio.rango_maximo - bio.rango_minimo) || 1) * 100
  ))

  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '12px 14px',
        marginBottom: '8px',
        border: '0.5px solid #eee',
        cursor: 'pointer',
        transition: 'box-shadow 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a' }}>
            {bio.nombre_simple}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '15px', fontWeight: '700', color: c.text }}>
            {bio.valor} <span style={{ fontSize: '11px', fontWeight: '400', color: '#aaa' }}>{bio.unidad}</span>
          </span>
          <span style={{
            background: c.bg,
            color: c.text,
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: '600',
            padding: '2px 8px',
          }}>
            {c.emoji}
          </span>
        </div>
      </div>

      <div style={{ height: '6px', background: '#f0f0f0', borderRadius: '3px', position: 'relative' }}>
        <div style={{
          position: 'absolute',
          left: 0, top: 0,
          height: '100%',
          width: `${pct}%`,
          background: c.barra,
          borderRadius: '3px',
          transition: 'width 0.6s ease',
        }} />
      </div>

      <div style={{ fontSize: '11px', color: '#bbb', marginTop: '4px', textAlign: 'right' }}>
        Tocá para entender qué significa →
      </div>
    </div>
  )
}

export default function Semaforo({ datos }) {
  const [seleccionado, setSeleccionado] = useState(null)

  const alterados = datos.biomarcadores.filter(b => b.estado !== 'normal')
  const normales  = datos.biomarcadores.filter(b => b.estado === 'normal')

  return (
    <div>
      <div style={{
        background: alterados.length === 0 ? '#E1F5EE' : '#FAEEDA',
        border: `1px solid ${alterados.length === 0 ? '#1D9E75' : '#EF9F27'}`,
        borderRadius: '14px',
        padding: '16px 18px',
        marginBottom: '20px',
      }}>
        <div style={{
          fontSize: '15px',
          fontWeight: '600',
          color: alterados.length === 0 ? '#085041' : '#633806',
          marginBottom: '4px',
        }}>
          {alterados.length === 0
            ? '¡Todos tus valores están en rango normal!'
            : `${alterados.length} valor${alterados.length > 1 ? 'es' : ''} merece${alterados.length > 1 ? 'n' : ''} atención`
          }
        </div>
        <div style={{ fontSize: '13px', color: '#555', lineHeight: '1.5' }}>
          {datos.resumen_empatico}
        </div>
      </div>

      {alterados.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
            Requieren atención
          </div>
          {alterados.map((bio, i) => (
            <BarraBio key={i} bio={bio} onClick={() => setSeleccionado(bio)} />
          ))}
        </div>
      )}

      {normales.length > 0 && (
        <div>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
            En rango normal
          </div>
          {normales.map((bio, i) => (
            <BarraBio key={i} bio={bio} onClick={() => setSeleccionado(bio)} />
          ))}
        </div>
      )}

      {seleccionado && (
        <CardInteligente
          bio={seleccionado}
          onCerrar={() => setSeleccionado(null)}
        />
      )}
    </div>
  )
}*/}