// src/libros/Onboarding.jsx
// FASE 2B — Pantalla de bienvenida y elección de géneros favoritos

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { actualizarPerfil } from '../api/auth'
import { useAuth } from '../contexto/AuthContext'

const GENEROS = [
  { id: 'Terror',          emoji: '👻', desc: 'Historias que te quitan el sueño' },
  { id: 'Ciencia Ficción', emoji: '🚀', desc: 'Universos más allá de tu imaginación' },
  { id: 'Romance',         emoji: '💕', desc: 'Historias de amor y pasión' },
  { id: 'Historia',        emoji: '🏛️', desc: 'Relatos del pasado que moldean el presente' },
  { id: 'Misterio',        emoji: '🔍', desc: 'Enigmas que no podrás dejar de resolver' },
  { id: 'Fantasía',        emoji: '🧙', desc: 'Mundos mágicos sin límites' },
  { id: 'Biografía',       emoji: '👤', desc: 'Vidas que inspiran y transforman' },
  { id: 'Filosofía',       emoji: '🧠', desc: 'Preguntas que cambian tu perspectiva' },
  { id: 'Juvenil',         emoji: '⭐', desc: 'Aventuras para todas las edades' },
  { id: 'Bélico',          emoji: '⚔️', desc: 'Conflictos que marcaron la historia' },
  { id: 'Otro',            emoji: '📖', desc: 'Todo lo que no cabe en una categoría' },
]

function Onboarding() {
  const navigate = useNavigate()
  const { usuario, login, token } = useAuth()
  const [seleccionados, setSeleccionados] = useState([])
  const [cargando, setCargando] = useState(false)

  const toggleGenero = (id) => {
    setSeleccionados(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    )
  }

  const handleContinuar = async () => {
    setCargando(true)
    try {
      const generos_favoritos = seleccionados.join(',')
      const usuarioActualizado = await actualizarPerfil({ generos_favoritos })
      // Actualizar el contexto con los nuevos datos
      login(token, usuarioActualizado)
      navigate('/')
    } catch (err) {
      console.error('Error al guardar géneros:', err)
      navigate('/')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080b14',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;700&display=swap');
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Encabezado */}
      <div style={{ textAlign: 'center', marginBottom: '3rem', animation: 'fadeInUp 0.5s ease both' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          color: '#fff',
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          fontWeight: 900,
          marginBottom: '0.5rem',
          lineHeight: 1.2,
        }}>
          ¡Bienvenido, {usuario?.nombre?.split(' ')[0]}!
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', maxWidth: '420px' }}>
          ¿Qué géneros te apasionan? Elegí los que más te gusten para personalizar tu experiencia.
        </p>
      </div>

      {/* Grid de géneros */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '1rem',
        width: '100%',
        maxWidth: '700px',
        marginBottom: '2.5rem',
        animation: 'fadeInUp 0.5s ease 0.1s both',
      }}>
        {GENEROS.map((g, i) => {
          const activo = seleccionados.includes(g.id)
          return (
            <div
              key={g.id}
              onClick={() => toggleGenero(g.id)}
              style={{
                background: activo ? 'rgba(244,196,48,0.12)' : 'rgba(255,255,255,0.04)',
                border: activo ? '2px solid #f4c430' : '2px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '1.25rem 1rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'center',
                animation: `fadeInUp 0.4s ease ${i * 0.05}s both`,
                transform: activo ? 'translateY(-3px)' : 'none',
                boxShadow: activo ? '0 8px 24px rgba(244,196,48,0.15)' : 'none',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{g.emoji}</div>
              <div style={{
                color: activo ? '#f4c430' : '#fff',
                fontWeight: 700,
                fontSize: '0.9rem',
                marginBottom: '0.3rem',
              }}>{g.id}</div>
              <div style={{
                color: 'rgba(255,255,255,0.35)',
                fontSize: '0.72rem',
                lineHeight: 1.4,
              }}>{g.desc}</div>

              {activo && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: '#f4c430',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  color: '#080b14',
                  fontWeight: 900,
                }}>✓</div>
              )}
            </div>
          )
        })}
      </div>

      {/* Botones */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        animation: 'fadeInUp 0.5s ease 0.3s both',
      }}>
        <button
          onClick={handleContinuar}
          disabled={cargando}
          style={{
            background: seleccionados.length > 0 ? '#f4c430' : 'rgba(255,255,255,0.1)',
            color: seleccionados.length > 0 ? '#080b14' : 'rgba(255,255,255,0.3)',
            border: 'none',
            borderRadius: '12px',
            padding: '13px 40px',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: cargando ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: "'DM Sans', sans-serif",
            minWidth: '220px',
          }}
        >
          {cargando ? 'Guardando...' : seleccionados.length > 0
            ? `Continuar con ${seleccionados.length} género${seleccionados.length > 1 ? 's' : ''} →`
            : 'Continuar →'
          }
        </button>

        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.3)',
            fontSize: '0.85rem',
            cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Saltar por ahora
        </button>
      </div>
    </div>
  )
}

export default Onboarding