import { createPortal } from 'react-dom'

function ModalConfirmacion({ visible, titulo, mensaje, nombreLibro, onConfirmar, onCancelar }) {

  if (!visible) return null

  return createPortal(
    <>
      {/* Overlay con flexbox para centrar perfectamente */}
      <div
        onClick={onCancelar}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          zIndex: 9000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Modal — stopPropagation evita cerrar al hacer clic dentro */}
        <div
          onClick={e => e.stopPropagation()}
          style={{
            width: '90%',
            maxWidth: '440px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            padding: '2rem',
            animation: 'scaleIn 0.25s ease both',
            textAlign: 'center',
            zIndex: 9001,
          }}
        >
          {/* Ícono */}
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', fontSize: '1.8rem' }}>
            🗑️
          </div>

          {/* Título */}
          <h5 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text)', fontWeight: 700, marginBottom: '0.75rem' }}>
            {titulo}
          </h5>

          {/* Mensaje */}
          <p style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '0.5rem' }}>
            {mensaje}
          </p>

          {/* Nombre del libro */}
          {nombreLibro && (
            <p style={{ color: 'var(--gold)', fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1rem', marginBottom: '1.75rem' }}>
              "{nombreLibro}"
            </p>
          )}

          {/* Botones */}
          <div className="d-flex gap-3">
            <button
              onClick={onCancelar}
              style={{ flex: 1, background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px', fontWeight: 500, fontSize: '0.92rem', cursor: 'pointer', transition: 'all 0.2s ease' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--muted)'; e.currentTarget.style.color = 'var(--text)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}
            >
              Cancelar
            </button>
            <button
              onClick={onConfirmar}
              style={{ flex: 1, background: 'var(--red-acc)', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px', fontWeight: 700, fontSize: '0.92rem', cursor: 'pointer', transition: 'opacity 0.2s ease' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              <i className="bi bi-trash3-fill me-2"></i>
              Sí, eliminar
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}

export default ModalConfirmacion