import { useNavigate } from 'react-router-dom'

function PaginaNoEncontrada() {
  const navigate = useNavigate()

  return (
    <div
      className="container py-5"
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '24px',
          padding: '4rem 3rem',
          textAlign: 'center',
          maxWidth: '520px',
          width: '100%',
          animation: 'fadeInUp 0.5s ease both',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Gradiente decorativo de fondo */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 50% 0%, rgba(244,196,48,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Ícono */}
        <i
          className="bi bi-book-x"
          style={{
            fontSize: '5rem',
            color: 'var(--gold)',
            opacity: 0.7,
            display: 'block',
            marginBottom: '1.5rem',
          }}
        ></i>

        {/* Código de error */}
        <p
          style={{
            color: 'var(--gold)',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            marginBottom: '0.75rem',
          }}
        >
          · Error 404 ·
        </p>

        {/* Título */}
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            color: 'var(--text)',
            fontSize: '2rem',
            fontWeight: 900,
            marginBottom: '1rem',
            lineHeight: 1.2,
          }}
        >
          Página no encontrada
        </h2>

        {/* Mensaje */}
        <p
          style={{
            color: 'var(--muted)',
            lineHeight: 1.8,
            fontSize: '0.95rem',
            marginBottom: '2rem',
          }}
        >
          Este libro no existe en nuestra colección.
          <br />
          La página que buscas se ha perdido entre los estantes.
        </p>

        {/* Divisor decorativo */}
        <div
          style={{
            width: '48px',
            height: '2px',
            background: 'var(--gold)',
            borderRadius: '2px',
            margin: '0 auto 2rem',
            opacity: 0.4,
          }}
        />

        {/* Botón volver */}
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'var(--gold)',
            color: '#080b14',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 32px',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.opacity = '0.88'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.opacity = '1'
            e.currentTarget.style.transform = 'none'
          }}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Volver al inicio
        </button>
      </div>
    </div>
  )
}

export default PaginaNoEncontrada