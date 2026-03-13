import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

function Navegacion({ onBuscar }) {
  const [textoBusqueda, setTextoBusqueda] = useState('')
  const location = useLocation()

  const handleBusqueda = (valor) => {
    setTextoBusqueda(valor)
    onBuscar(valor)
  }

  const limpiarBusqueda = () => {
    setTextoBusqueda('')
    onBuscar('')
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

  return (
    <nav
      style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div className="container d-flex align-items-center gap-3 py-3 flex-wrap">

        {/* Brand */}
        <Link
          to="/"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: 'var(--gold)',
            fontSize: '1.3rem',
            fontWeight: 900,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          <i className="bi bi-book-half me-2"></i>
          Biblioteca
        </Link>

        {/* Links */}
        <div className="d-flex gap-2">
          <Link to="/" style={estiloLink('/')}>
            <i className="bi bi-collection me-1"></i>
            Colección
          </Link>
          <Link to="/agregar" style={estiloLink('/agregar')}>  {/* [NUEVO] */}
            <i className="bi bi-plus-lg me-1"></i>
            Agregar
          </Link>
        </div>

        {/* Search bar */}
        <div
          className="d-flex align-items-center ms-auto"
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
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--muted)',
                cursor: 'pointer',
                padding: 0,
                lineHeight: 1,
                fontSize: '1rem',
              }}
            >
              <i className="bi bi-x"></i>
            </button>
          )}
        </div>

      </div>
    </nav>
  )
}

export default Navegacion