// src/libros/AuthPage.jsx
// FASE 1A — Rediseño completo Login/Registro
// Pantalla dividida: mosaico de portadas a la izquierda, formulario a la derecha

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registrarUsuario, loginUsuario } from '../api/auth'
import { useAuth } from '../contexto/AuthContext'

// ISBNs de libros famosos para el mosaico de portadas
const PORTADAS = [
  '9780743273565', '9780061096525', '9780451524935', '9780062315007',
  '9780385490818', '9781501156700', '9780679720201', '9780316769174',
  '9780140449136', '9780743477123', '9780525559474', '9781250301697',
  '9780679783268', '9780060935467', '9780385737951', '9780439023481',
  '9780547928227', '9780062409850', '9781250301703', '9780553381689',
]

function AuthPage() {
  const navigate  = useNavigate()
  const { login } = useAuth()

  const [modo, setModo]       = useState('login') // 'login' | 'registro'
  const [cargando, setCargando] = useState(false)
  const [error, setError]     = useState('')

  const [form, setForm] = useState({
    nombre: '', email: '', password: '', confirmar: '', fecha_nacimiento: '',
  })

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (modo === 'registro') {
      if (!form.nombre.trim())          return setError('El nombre es obligatorio.')
      if (!form.email.trim())           return setError('El email es obligatorio.')
      if (form.password.length < 6)     return setError('Mínimo 6 caracteres.')
      if (form.password !== form.confirmar) return setError('Las contraseñas no coinciden.')
    }

    setCargando(true)
    try {
      let data
      if (modo === 'login') {
        data = await loginUsuario({ email: form.email, password: form.password })
      } else {
        data = await registrarUsuario({
          nombre: form.nombre.trim(),
          email: form.email.trim(),
          password: form.password,
          fecha_nacimiento: form.fecha_nacimiento || null,
        })
      }
      login(data.access_token, data.usuario)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Ocurrió un error. Intentá de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  const cambiarModo = (nuevoModo) => {
    setModo(nuevoModo)
    setError('')
    setForm({ nombre: '', email: '', password: '', confirmar: '', fecha_nacimiento: '' })
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: '#080b14',
      fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* ── LADO IZQUIERDO — Mosaico de portadas ── */}
      <div style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        display: 'none',
      }}
        className="auth-left"
      >
        {/* Mosaico */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'repeat(5, 1fr)',
          gap: '6px',
          padding: '6px',
          transform: 'rotate(-5deg) scale(1.2)',
          transformOrigin: 'center center',
        }}>
          {PORTADAS.map((isbn, i) => (
            <div key={isbn} style={{
              borderRadius: '8px',
              overflow: 'hidden',
              animation: `floatCard ${3 + (i % 4) * 0.5}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.15}s`,
            }}>
              <img
                src={`https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={e => { e.target.style.background = '#1a1f2e' }}
              />
            </div>
          ))}
        </div>

        {/* Overlay degradado */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(8,11,20,0.7) 0%, rgba(8,11,20,0.4) 50%, rgba(8,11,20,0.85) 100%)',
        }} />

        {/* Texto sobre el mosaico */}
        <div style={{
          position: 'absolute',
          bottom: '3rem',
          left: '3rem',
          right: '3rem',
          zIndex: 2,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1.5rem',
          }}>
            <span style={{ fontSize: '2rem' }}>📚</span>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              color: '#f4c430',
              fontSize: '1.6rem',
              fontWeight: 900,
              letterSpacing: '-0.02em',
            }}>Biblioteca</span>
          </div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            color: '#fff',
            fontSize: 'clamp(2rem, 3vw, 3rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: '1rem',
          }}>
            Tu colección,<br />
            <span style={{ color: '#f4c430' }}>tu mundo.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', lineHeight: 1.6 }}>
            Organiza, descubre y disfruta cada libro que has leído.
          </p>
        </div>
      </div>

      {/* ── LADO DERECHO — Formulario ── */}
      <div style={{
        width: '100%',
        maxWidth: '480px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
        zIndex: 1,
      }}
        className="auth-right"
      >
        {/* Logo mobile */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '2.5rem',
        }}
          className="auth-logo-mobile"
        >
          <span style={{ fontSize: '1.6rem' }}>📚</span>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            color: '#f4c430',
            fontSize: '1.4rem',
            fontWeight: 900,
          }}>Biblioteca</span>
        </div>

        {/* Toggle Login/Registro */}
        <div style={{
          display: 'flex',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '14px',
          padding: '4px',
          marginBottom: '2rem',
        }}>
          {['login', 'registro'].map(m => (
            <button
              key={m}
              onClick={() => cambiarModo(m)}
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                borderRadius: '10px',
                background: modo === m ? '#f4c430' : 'transparent',
                color: modo === m ? '#080b14' : 'rgba(255,255,255,0.5)',
                fontWeight: modo === m ? 700 : 500,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {m === 'login' ? 'Ingresar' : 'Crear cuenta'}
            </button>
          ))}
        </div>

        {/* Título */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            color: '#fff',
            fontSize: '2rem',
            fontWeight: 900,
            marginBottom: '0.25rem',
            lineHeight: 1.2,
          }}>
            {modo === 'login' ? 'Bienvenido de vuelta' : 'Creá tu cuenta'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
            {modo === 'login'
              ? 'Ingresá para ver tu biblioteca personal'
              : 'Empezá a organizar tus libros hoy'}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: '10px',
            padding: '10px 14px',
            color: '#ef4444',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Campos del formulario */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Nombre — solo en registro */}
          {modo === 'registro' && (
            <Campo label="Nombre completo" name="nombre" type="text"
              value={form.nombre} onChange={handleChange} placeholder="Tu nombre" />
          )}

          <Campo label="Email" name="email" type="email"
            value={form.email} onChange={handleChange} placeholder="tu@email.com" />

          {/* Fecha nacimiento — solo en registro */}
          {modo === 'registro' && (
            <Campo label="Fecha de nacimiento (opcional)" name="fecha_nacimiento" type="date"
              value={form.fecha_nacimiento} onChange={handleChange} />
          )}

          <Campo label="Contraseña" name="password" type="password"
            value={form.password} onChange={handleChange}
            placeholder={modo === 'registro' ? 'Mínimo 6 caracteres' : '••••••••'} />

          {/* Confirmar password — solo en registro */}
          {modo === 'registro' && (
            <Campo label="Confirmar contraseña" name="confirmar" type="password"
              value={form.confirmar} onChange={handleChange} placeholder="Repetí tu contraseña" />
          )}

          {/* Botón submit */}
          <button
            onClick={handleSubmit}
            disabled={cargando}
            style={{
              width: '100%',
              padding: '13px',
              marginTop: '0.5rem',
              background: cargando ? 'rgba(244,196,48,0.5)' : '#f4c430',
              color: '#080b14',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: cargando ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: '0.01em',
            }}
            onMouseEnter={e => { if (!cargando) e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
          >
            {cargando
              ? (modo === 'login' ? 'Ingresando...' : 'Creando cuenta...')
              : (modo === 'login' ? 'Ingresar →' : 'Crear cuenta →')
            }
          </button>
        </div>

        <p style={{
          color: 'rgba(255,255,255,0.3)',
          fontSize: '0.78rem',
          textAlign: 'center',
          marginTop: '2rem',
        }}>
          {modo === 'login' ? '¿No tenés cuenta? ' : '¿Ya tenés cuenta? '}
          <button
            onClick={() => cambiarModo(modo === 'login' ? 'registro' : 'login')}
            style={{
              background: 'none',
              border: 'none',
              color: '#f4c430',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.78rem',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {modo === 'login' ? 'Creá una acá' : 'Ingresá acá'}
          </button>
        </p>
      </div>

      {/* Estilos globales para esta página */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;700&display=swap');

        @keyframes floatCard {
          from { transform: translateY(0px); }
          to   { transform: translateY(-8px); }
        }

        @media (min-width: 768px) {
          .auth-left  { display: flex !important; }
          .auth-right { max-width: 440px !important; margin: 0 !important; border-left: 1px solid rgba(255,255,255,0.06); }
          .auth-logo-mobile { display: none !important; }
        }
      `}</style>
    </div>
  )
}

// Componente auxiliar para inputs
function Campo({ label, name, type, value, onChange, placeholder }) {
  return (
    <div>
      <label style={{
        color: 'rgba(255,255,255,0.4)',
        fontSize: '0.72rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        marginBottom: '6px',
        display: 'block',
      }}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: '100%',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '10px',
          padding: '11px 14px',
          color: '#fff',
          fontSize: '0.92rem',
          outline: 'none',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          fontFamily: "'DM Sans', sans-serif",
        }}
        onFocus={e => {
          e.target.style.borderColor = 'rgba(244,196,48,0.5)'
          e.target.style.boxShadow = '0 0 0 3px rgba(244,196,48,0.08)'
        }}
        onBlur={e => {
          e.target.style.borderColor = 'rgba(255,255,255,0.08)'
          e.target.style.boxShadow = 'none'
        }}
      />
    </div>
  )
}

export default AuthPage