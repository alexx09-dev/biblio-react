// src/componentes/Navegacion.jsx
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexto/AuthContext'

function Navegacion({ onBuscar }) {
  const [textoBusqueda, setTextoBusqueda] = useState('')
  const [menuAbierto, setMenuAbierto] = useState(false)
  const location  = useLocation()
  const navigate  = useNavigate()
  const { usuario, logueado, cerrarSesion } = useAuth()

  const handleBusqueda = (valor) => {
    setTextoBusqueda(valor)
    onBuscar(valor)
  }

  const limpiarBusqueda = () => {
    setTextoBusqueda('')
    onBuscar('')
  }

  const handleCerrarSesion = () => {
    cerrarSesion()
    setMenuAbierto(false)
    navigate('/login')
  }

  const esActivo = (path) => location.pathname === path

  const estiloLink = (path) => ({
    textDecoration: 'none',
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '0.88rem',
    fontWeight: 500,
    color: esActivo(path) ? '#080b14' : 'var(--muted)',
    background: esActivo(path) ? 'var(--gold)' : 'transparent',
    border: esActivo(path) ? '1px solid var(--gold)' : '1px solid transparent',
    transition: 'all 0.2s ease',
  })

  const iniciales = usuario?.nombre
    ? usuario.nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <nav style={{
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div className="container d-flex align-items-center gap-3 py-3 flex-wrap">

        {/* Brand */}
        <Link to="/" style={{
          fontFamily: "'Playfair Display', serif",
          color: 'var(--gold)',
          fontSize: '1.3rem',
          fontWeight: 900,
          textDecoration: 'none',
          whiteSpace: 'nowrap',
        }}>
          <i className="bi bi-book-half me-2"></i>
          Biblioteca
        </Link>

        {/* Links — solo si está logueado */}
        {logueado && (
          <div className="d-flex gap-2">
            <Link to="/" style={estiloLink('/')}>
              <i className="bi bi-collection me-1"></i>Colección
            </Link>
            <Link to="/agregar" style={estiloLink('/agregar')}>
              <i className="bi bi-plus-lg me-1"></i>Agregar
            </Link>
          </div>
        )}

        {/* Buscador — solo si está logueado */}
        {logueado && (
          <div
            className="d-flex align-items-center"
            style={{
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '6px 12px',
              gap: '8px',
              minWidth: '220px',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            }}
            onFocus={e => {
              e.currentTarget.style.borderColor = 'var(--gold)'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(244,196,48,0.1)'
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <i className="bi bi-search" style={{ color: 'var(--muted)', fontSize: '0.85rem' }}></i>
            <input
              type="text"
              value={textoBusqueda}
              onChange={e => handleBusqueda(e.target.value)}
              placeholder="Buscar libros..."
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text)',
                fontSize: '0.88rem',
                flex: 1,
                width: '100%',
              }}
            />
            {textoBusqueda && (
              <button
                onClick={limpiarBusqueda}
                style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: 0, lineHeight: 1, fontSize: '1rem' }}
              >
                <i className="bi bi-x"></i>
              </button>
            )}
          </div>
        )}

        {/* Sección derecha */}
        <div className="ms-auto d-flex align-items-center gap-2">

          {/* No logueado — botones */}
          {!logueado && (
            <>
              <Link to="/login" style={{
                textDecoration: 'none',
                padding: '6px 16px',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: 500,
                color: 'var(--muted)',
                border: '1px solid var(--border)',
                transition: 'all 0.2s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}
              >
                Ingresar
              </Link>
              <Link to="/login" style={{
                textDecoration: 'none',
                padding: '6px 16px',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: 700,
                color: '#080b14',
                background: 'var(--gold)',
                border: '1px solid var(--gold)',
                transition: 'all 0.2s ease',
              }}>
                Registrarse
              </Link>
            </>
          )}

          {/* Logueado — avatar con menú */}
          {logueado && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setMenuAbierto(!menuAbierto)}
                style={{
                  background: 'var(--gold)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '38px',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  color: '#080b14',
                  backgroundImage: usuario?.foto_perfil ? `url(${usuario.foto_perfil})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {!usuario?.foto_perfil && iniciales}
              </button>

              {menuAbierto && (
                <div style={{
                  position: 'absolute',
                  top: '46px',
                  right: 0,
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '0.5rem',
                  minWidth: '180px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                  zIndex: 200,
                  animation: 'fadeInUp 0.15s ease both',
                }}>
                  <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', marginBottom: '0.4rem' }}>
                    <p style={{ color: 'var(--text)', fontSize: '0.85rem', fontWeight: 600, marginBottom: 0 }}>
                      {usuario?.nombre}
                    </p>
                    <p style={{ color: 'var(--muted)', fontSize: '0.75rem', marginBottom: 0 }}>
                      {usuario?.email}
                    </p>
                  </div>

                  <button
                    onClick={() => { navigate('/perfil'); setMenuAbierto(false) }}
                    style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--muted)', fontSize: '0.85rem', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.color = 'var(--text)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--muted)' }}
                  >
                    <i className="bi bi-person-circle me-2"></i>Mi perfil
                  </button>

                  <button
                    onClick={handleCerrarSesion}
                    style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--red-acc)', fontSize: '0.85rem', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navegacion