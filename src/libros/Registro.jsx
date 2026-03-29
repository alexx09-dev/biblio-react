// src/libros/Registro.jsx
// Pantalla de registro de nueva cuenta
// El usuario completa sus datos para crear su biblioteca personal

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registrarUsuario } from '../api/auth'
import { useAuth } from '../contexto/AuthContext'

function Registro() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmar: '',          // Solo existe en el frontend para validar que las passwords coincidan
    fecha_nacimiento: '',
  })
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validaciones del lado del frontend antes de llamar al backend
    if (!form.nombre.trim()) return setError('El nombre es obligatorio.')
    if (!form.email.trim())  return setError('El email es obligatorio.')
    if (form.password.length < 6) return setError('La contraseña debe tener al menos 6 caracteres.')
    if (form.password !== form.confirmar) return setError('Las contraseñas no coinciden.')

    setCargando(true)
    setError('')

    try {
      // Armamos el payload SIN el campo confirmar — el backend no lo necesita
      const payload = {
        nombre: form.nombre.trim(),
        email: form.email.trim(),
        password: form.password,
        fecha_nacimiento: form.fecha_nacimiento || null,
      }
      const data = await registrarUsuario(payload)
      login(data.usuario)
      navigate('/')   // Redirige al inicio después del registro
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al crear la cuenta.')
    } finally {
      setCargando(false)
    }
  }

  // Reutilizamos el mismo estilo para todos los inputs
  const estiloInput = {
    width: '100%',
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    padding: '10px 14px',
    color: 'var(--text)',
    fontSize: '0.9rem',
    outline: 'none',
  }

  const estiloLabel = {
    color: 'var(--muted)',
    fontSize: '0.78rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '0.4rem',
    display: 'block',
  }

  return (
    <div className="container py-5" style={{ maxWidth: '440px' }}>
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
          <i className="bi bi-person-plus" style={{ fontSize: '2.5rem', color: 'var(--gold)' }}></i>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              color: 'var(--gold)',
              fontWeight: 900,
              marginTop: '0.5rem',
              marginBottom: '0.25rem',
            }}
          >
            Crear cuenta
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
            Empezá tu biblioteca personal hoy
          </p>
        </div>

        {/* Error */}
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

          {/* Nombre */}
          <div>
            <label style={estiloLabel}>Nombre completo</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Tu nombre"
              style={estiloInput}
              onFocus={e => e.target.style.borderColor = 'var(--gold)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {/* Email */}
          <div>
            <label style={estiloLabel}>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              style={estiloInput}
              onFocus={e => e.target.style.borderColor = 'var(--gold)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {/* Fecha de nacimiento */}
          <div>
            <label style={estiloLabel}>Fecha de nacimiento <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(opcional)</span></label>
            <input
              type="date"
              name="fecha_nacimiento"
              value={form.fecha_nacimiento}
              onChange={handleChange}
              style={estiloInput}
              onFocus={e => e.target.style.borderColor = 'var(--gold)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {/* Password */}
          <div>
            <label style={estiloLabel}>Contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              style={estiloInput}
              onFocus={e => e.target.style.borderColor = 'var(--gold)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          {/* Confirmar password */}
          <div>
            <label style={estiloLabel}>Confirmar contraseña</label>
            <input
              type="password"
              name="confirmar"
              value={form.confirmar}
              onChange={handleChange}
              placeholder="Repetí tu contraseña"
              style={estiloInput}
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
            {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </div>

        {/* Link a login */}
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', textAlign: 'center', marginTop: '1.5rem', marginBottom: 0 }}>
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 600 }}>
            Ingresá acá
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Registro