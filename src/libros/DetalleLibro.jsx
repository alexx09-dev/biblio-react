import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { obtenerLibroPorId, eliminarLibro } from '../api/libros'
import ModalConfirmacion from '../componentes/ModalConfirmacion'
import Toast from '../componentes/Toast'

const renderEstrellas = (rating) => {
  const llenas = Math.round(rating)
  const vacias = 5 - llenas
  return (
    <span style={{ color: 'var(--gold)', fontSize: '1.6rem' }}>
      {'★'.repeat(llenas)}{'☆'.repeat(vacias)}
    </span>
  )
}

const SkeletonDetalle = () => (
  <div className="row g-5">
    <div className="col-12 col-md-4">
      <div style={{ aspectRatio: '2/3', borderRadius: '16px', background: 'linear-gradient(90deg, var(--surface) 25%, var(--surface2) 50%, var(--surface) 75%)', backgroundSize: '800px 100%', animation: 'shimmer 1.4s infinite linear' }} />
    </div>
    <div className="col-12 col-md-8 d-flex flex-column gap-3 pt-4">
      {[80, 50, 100, 60, 90].map((w, i) => (
        <div key={i} style={{ height: i === 0 ? '48px' : '18px', width: `${w}%`, borderRadius: '8px', background: 'linear-gradient(90deg, var(--surface) 25%, var(--surface2) 50%, var(--surface) 75%)', backgroundSize: '800px 100%', animation: 'shimmer 1.4s infinite linear' }} />
      ))}
    </div>
  </div>
)

function DetalleLibro() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [libro, setLibro]               = useState(null)
  const [cargando, setCargando]         = useState(true)
  const [portadaError, setPortadaError] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [toast, setToast]               = useState({ visible: false, mensaje: '', tipo: 'success' })

  useEffect(() => {
    obtenerLibroPorId(id)
      .then(datos => setLibro(datos))
      .catch(err => {
        console.error('Error al cargar libro:', err)
        navigate('/')
      })
      .finally(() => setCargando(false))
  }, [id])

  const handleConfirmarEliminar = async () => {
    try {
      await eliminarLibro(libro.id)
      setToast({ visible: true, mensaje: `"${libro.titulo}" eliminado correctamente.`, tipo: 'success' })
      setTimeout(() => navigate('/'), 1500)
    } catch (err) {
      setToast({ visible: true, mensaje: 'Error al eliminar el libro.', tipo: 'danger' })
    } finally {
      setModalVisible(false)
    }
  }

  return (
    <div className="container py-4" style={{ maxWidth: '1000px' }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '24px', padding: '2.5rem', animation: 'slideInUp 0.4s ease both' }}>
        {cargando ? (
          <SkeletonDetalle />
        ) : libro ? (
          <div className="row g-5">

            {/* Columna izquierda — Portada + metadatos */}
            <div className="col-12 col-md-4">
              <div style={{ aspectRatio: '2/3', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '-8px 12px 40px rgba(0,0,0,0.6)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--gold)', zIndex: 2 }} />
                {libro.isbn && !portadaError ? (
                  <img
                    src={`https://covers.openlibrary.org/b/isbn/${libro.isbn}-L.jpg`}
                    alt={`Portada de ${libro.titulo}`}
                    onError={() => setPortadaError(true)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'linear-gradient(160deg, var(--surface2) 0%, var(--bg) 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '1.5rem' }}>
                    <span style={{ fontSize: '4rem', opacity: 0.3 }}>📖</span>
                    <p style={{ fontFamily: "'Playfair Display', serif", color: 'var(--muted)', fontSize: '0.85rem', textAlign: 'center', fontStyle: 'italic', lineHeight: 1.4, marginBottom: 0 }}>{libro.titulo}</p>
                  </div>
                )}
              </div>

              {(libro.anio || libro.isbn || libro.genero) && (
                <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem', marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {libro.anio && (
                    <div className="d-flex align-items-center gap-2">
                      <span style={{ fontSize: '0.9rem' }}>📅</span>
                      <span style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>Año: <span style={{ color: 'var(--text)' }}>{libro.anio}</span></span>
                    </div>
                  )}
                  {libro.isbn && (
                    <div className="d-flex align-items-center gap-2">
                      <span style={{ fontSize: '0.9rem' }}>🌍</span>
                      <span style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>ISBN: <span style={{ color: 'var(--text)' }}>{libro.isbn}</span></span>
                    </div>
                  )}
                  {libro.genero && (
                    <div className="d-flex align-items-center gap-2">
                      <span style={{ fontSize: '0.9rem' }}>📚</span>
                      <span style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>Género: <span style={{ color: 'var(--text)' }}>{libro.genero}</span></span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Columna derecha — Información */}
            <div className="col-12 col-md-8">

              {/* Breadcrumb */}
              <div className="d-flex align-items-center gap-2 mb-3">
                <span onClick={() => navigate('/')} style={{ color: 'var(--muted)', fontSize: '0.82rem', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>Listado</span>
                <span style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>›</span>
                <span style={{ color: 'var(--text)', fontSize: '0.82rem' }}>Detalle del libro</span>
              </div>

              {libro.genero && (
                <span style={{ background: 'rgba(244,196,48,0.1)', color: 'var(--gold)', border: '1px solid rgba(244,196,48,0.25)', borderRadius: '20px', padding: '3px 14px', fontSize: '0.78rem', fontWeight: 600, display: 'inline-block', marginBottom: '1rem' }}>
                  {libro.genero}
                </span>
              )}

              <h1 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text)', fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: '0.75rem' }}>
                {libro.titulo}
              </h1>

              <p style={{ color: 'var(--muted)', fontSize: '1.05rem', fontStyle: 'italic', marginBottom: '1.25rem' }}>
                <i className="bi bi-person-fill me-2"></i>{libro.autor}
              </p>

              <div className="mb-1">
                <p style={{ color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>Calificación personal</p>
                {renderEstrellas(libro.rating || 0)}
              </div>

              <div style={{ height: '1px', background: 'var(--border)', margin: '1.5rem 0' }} />

              <div className="mb-4">
                <div className="d-flex align-items-center gap-3 mb-2">
                  <p style={{ color: 'var(--text)', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 0 }}>Sinopsis</p>
                  <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                </div>
                <p style={{ color: 'var(--muted)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                  {libro.sinopsis || 'La sinopsis de este libro no está disponible aún.'}
                </p>
              </div>

              <div className="d-flex flex-wrap gap-2 mb-4">
                {libro.genero && (
                  <span style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: '20px', padding: '4px 14px', fontSize: '0.78rem' }}>{libro.genero}</span>
                )}
                {libro.anio && (
                  <span style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: '20px', padding: '4px 14px', fontSize: '0.78rem' }}>{libro.anio}</span>
                )}
                {libro.rating === 5 && (
                  <span style={{ background: 'rgba(244,196,48,0.1)', border: '1px solid rgba(244,196,48,0.25)', color: 'var(--gold)', borderRadius: '20px', padding: '4px 14px', fontSize: '0.78rem', fontWeight: 600 }}>★ Clásico</span>
                )}
              </div>

              {/* Botones de acción */}
              <div className="d-flex gap-2 flex-wrap">
                <button
                  onClick={() => navigate('/')}
                  style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: '10px', padding: '9px 20px', fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.2s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}
                >
                  <i className="bi bi-arrow-left me-2"></i>Volver al listado
                </button>

                <button
                  onClick={() => navigate(`/editar/${libro.id}`)}
                  style={{ background: 'rgba(59,130,246,0.15)', color: 'var(--blue-acc)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: '10px', padding: '9px 20px', fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.2s ease' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.25)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(59,130,246,0.15)'}
                >
                  <i className="bi bi-pencil-fill me-2"></i>Editar
                </button>

                <button
                  onClick={() => setModalVisible(true)}
                  style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--red-acc)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '9px 20px', fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.2s ease' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.25)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
                >
                  <i className="bi bi-trash3-fill me-2"></i>Eliminar
                </button>
              </div>

            </div>
          </div>
        ) : null}
      </div>

      <ModalConfirmacion
        visible={modalVisible}
        titulo="¿Eliminar libro?"
        mensaje="Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar"
        nombreLibro={libro?.titulo}
        onConfirmar={handleConfirmarEliminar}
        onCancelar={() => setModalVisible(false)}
      />

      <Toast
        visible={toast.visible}
        mensaje={toast.mensaje}
        tipo={toast.tipo}
        onClose={() => setToast(prev => ({ ...prev, visible: false }))}
      />
    </div>
  )
}

export default DetalleLibro
