// src/libros/Login.jsx
// Pantalla de inicio de sesión
// El usuario ingresa su email y password para entrar a su biblioteca

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUsuario } from '../api/auth'
import { useAuth } from '../contexto/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { iniciarSesion } = useAuth()

  // Guardamos lo que el usuario escribe en los campos
  const [form, setForm] = useState({ email: '', password: '' })
  // cargando evita que el usuario haga clic múltiples veces
  const [cargando, setCargando] = useState(false)
  // error muestra el mensaje si algo sale mal
  const [error, setError] = useState('')

  const handleChange = (e) => {
    // Actualiza solo el campo que cambió, sin tocar los demás
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('') // Limpia el error cada vez que el usuario escribe algo
  }

  const handleSubmit = async (e) => {
    e.preventDefault() // Evita que la página se recargue al enviar el form
    setCargando(true)
    setError('')
    try {
      const data = await loginUsuario(form)
      iniciarSesion(data.usuario) // Guarda el usuario en el contexto global
      navigate('/')               // Redirige al inicio después del login
    } catch (err) {
      // Si el backend devuelve un mensaje de error, lo mostramos
      setError(err.response?.data?.detail || 'Error al iniciar sesión.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div
      className="container py-5"
      style={{ maxWidth: '440px' }}
    >
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '24px',
          padding: '2.5rem',
          animation: 'slideInUp 0.4s ease both',
        }}
      >
        {/* Encabezado */}
        <div className="text-center mb-4">
          <i className="bi bi-book-half" style={{ fontSize: '2.5rem', color: 'var(--gold)' }}></i>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              color: 'var(--gold)',
              fontWeight: 900,
              marginTop: '0.5rem',
              marginBottom: '0.25rem',
            }}
          >
            Bienvenido
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
            Ingresá a tu biblioteca personal
          </p>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: '10px',
              padding: '10px 14px',
              color: 'var(--red-acc)',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
            }}
          >
            <i className="bi bi-exclamation-circle me-2"></i>{error}
          </div>
        )}

        {/* Formulario */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Email */}
          <div>
            <label style={{ color: 'var(--muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem', display: 'block' }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              style={{
                width: '100%',
                background: 'var(--surface2)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '10px 14px',
                color: 'var(--text)',
                fontSize: '0.9rem',
                outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--gold)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{ color: 'var(--muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem', display: 'block' }}>
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              style={{
                width: '100%',
                background: 'var(--surface2)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '10px 14px',
                color: 'var(--text)',
                fontSize: '0.9rem',
                outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--gold)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {/* Botón */}
          <button
            onClick={handleSubmit}
            disabled={cargando}
            style={{
              background: cargando ? 'var(--surface2)' : 'var(--gold)',
              color: cargando ? 'var(--muted)' : '#080b14',
              border: 'none',
              borderRadius: '10px',
              padding: '11px',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: cargando ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              marginTop: '0.5rem',
            }}
          >
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </div>

        {/* Link a registro */}
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', textAlign: 'center', marginTop: '1.5rem', marginBottom: 0 }}>
          ¿No tenés cuenta?{' '}
          <Link to="/registro" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 600 }}>
            Creá una acá
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login