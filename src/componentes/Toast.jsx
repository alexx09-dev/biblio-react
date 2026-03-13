import { useEffect } from 'react'

function Toast({ mensaje, tipo = 'success', visible, onClose }) {

  // Auto-cierre después de 3 segundos
  useEffect(() => {
    if (!visible) return
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [visible])

  if (!visible) return null

  const colores = {
    success: 'var(--green-acc)',
    danger:  'var(--red-acc)',
    warning: 'var(--gold)',
  }

  const iconos = {
    success: '✅',
    danger:  '❌',
    warning: '⚠️',
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 9999,
        minWidth: '300px',
        maxWidth: '400px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderLeft: `4px solid ${colores[tipo]}`,
        borderRadius: '14px',
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        animation: 'slideInRight 0.3s ease both',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      {/* Ícono */}
      <span style={{ fontSize: '1.1rem', lineHeight: 1.4 }}>
        {iconos[tipo]}
      </span>

      {/* Mensaje */}
      <p style={{ color: 'var(--text)', fontSize: '0.88rem', marginBottom: 0, flex: 1, lineHeight: 1.5 }}>
        {mensaje}
      </p>

      {/* Botón cerrar */}
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--muted)',
          cursor: 'pointer',
          fontSize: '1.1rem',
          padding: 0,
          lineHeight: 1,
        }}
      >
        <i className="bi bi-x"></i>
      </button>
    </div>
  )
}

export default Toast