import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { obtenerLibroPorId, eliminarLibro } from '../api/libros'
import ModalConfirmacion from '../componentes/ModalConfirmacion'
import Toast from '../componentes/Toast'

// ─── Componente: Leer este libro ────────────────────────────────────────────
// Busca en Open Library si hay un PDF/ePub disponible para lectura gratuita.
// Si no hay, ofrece links externos alternativos sin infringir derechos de autor.
function LeerLibro({ libro }) {
  const [estado, setEstado]   = useState('idle')   // idle | buscando | listo | sin_pdf
  const [enlacePdf, setEnlacePdf] = useState(null)
  const [abierto, setAbierto] = useState(false)

  const buscarPdf = async () => {
    setEstado('buscando')
    setAbierto(true)
    try {
      // 1. Intentar por ISBN en Open Library
      let olid = null
      if (libro.isbn) {
        const resBiblio = await fetch(
          `https://openlibrary.org/api/books?bibkeys=ISBN:${libro.isbn}&format=json&jscmd=data`
        )
        const dataBiblio = await resBiblio.json()
        const key = `ISBN:${libro.isbn}`
        if (dataBiblio[key]?.key) {
          olid = dataBiblio[key].key.replace('/works/', '').replace('/books/', '')
        }
      }

      // 2. Si no hay ISBN, buscar por título + autor
      if (!olid) {
        const query = encodeURIComponent(`${libro.titulo} ${libro.autor}`)
        const resSearch = await fetch(
          `https://openlibrary.org/search.json?q=${query}&fields=key,edition_key&limit=1`
        )
        const dataSearch = await resSearch.json()
        if (dataSearch.docs?.[0]?.edition_key?.[0]) {
          olid = dataSearch.docs[0].edition_key[0]
        }
      }

      // 3. Verificar disponibilidad en Internet Archive a través de Open Library
      if (olid) {
        const resAvail = await fetch(
          `https://openlibrary.org/api/books?bibkeys=OLID:${olid}&format=json&jscmd=viewapi`
        )
        const dataAvail = await resAvail.json()
        const info = dataAvail[`OLID:${olid}`]
        if (info?.preview_url && info?.preview === 'full') {
          // Libro completo disponible
          setEnlacePdf(info.preview_url)
          setEstado('listo')
          return
        }
        if (info?.preview_url) {
          // Solo preview parcial
          setEnlacePdf(info.preview_url)
          setEstado('preview')
          return
        }
      }

      setEstado('sin_pdf')
    } catch {
      setEstado('sin_pdf')
    }
  }

  // Búsquedas alternativas
  const tituloEnc = encodeURIComponent(libro.titulo)
  const autorEnc  = encodeURIComponent(libro.autor)
  const isbnEnc   = libro.isbn || ''

  const alternativas = [
    {
      nombre: 'Project Gutenberg',
      icono: '📖',
      url: `https://www.gutenberg.org/ebooks/search/?query=${tituloEnc}`,
      desc: 'Miles de libros clásicos en dominio público',
    },
    {
      nombre: 'Internet Archive',
      icono: '🏛️',
      url: `https://archive.org/search?query=${tituloEnc}+${autorEnc}`,
      desc: 'Biblioteca digital con préstamo gratuito',
    },
    {
      nombre: 'Google Books',
      icono: '🔍',
      url: `https://www.google.com/search?q=${tituloEnc}+${autorEnc}+filetype:pdf+site:books.google.com`,
      desc: 'Fragmentos y previews en Google Books',
    },
    {
      nombre: 'Open Library',
      icono: '🌐',
      url: `https://openlibrary.org/search?q=${tituloEnc}&author=${autorEnc}`,
      desc: 'Catálogo universal con préstamo digital',
    },
  ]

  if (!abierto) {
    return (
      <div className="mb-4">
        <div style={{ height: '1px', background: 'var(--border)', marginBottom: '1.5rem' }} />
        <button
          onClick={buscarPdf}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'linear-gradient(135deg, rgba(244,196,48,0.12), rgba(244,196,48,0.06))',
            border: '1px solid rgba(244,196,48,0.3)',
            borderRadius: '12px',
            padding: '12px 20px',
            cursor: 'pointer',
            color: 'var(--gold)',
            fontSize: '0.9rem',
            fontWeight: 600,
            width: '100%',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,196,48,0.18)'}
          onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(135deg, rgba(244,196,48,0.12), rgba(244,196,48,0.06))'}
        >
          <i className="bi bi-book-fill" style={{ fontSize: '1.2rem' }}></i>
          <span>Leer este libro</span>
          <i className="bi bi-chevron-right ms-auto" style={{ fontSize: '0.8rem', opacity: 0.6 }}></i>
        </button>
      </div>
    )
  }

  return (
    <div className="mb-4">
      <div style={{ height: '1px', background: 'var(--border)', marginBottom: '1.5rem' }} />

      <div style={{
        background: 'var(--surface2)',
        border: '1px solid var(--border)',
        borderRadius: '14px',
        overflow: 'hidden',
        animation: 'fadeInUp 0.3s ease both',
      }}>
        {/* Header */}
        <div
          onClick={() => setAbierto(!abierto)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 18px',
            cursor: 'pointer',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <i className="bi bi-book-fill" style={{ color: 'var(--gold)' }}></i>
          <span style={{ color: 'var(--text)', fontWeight: 600, fontSize: '0.9rem' }}>Leer este libro</span>
          <i className={`bi bi-chevron-${abierto ? 'up' : 'down'} ms-auto`} style={{ color: 'var(--muted)', fontSize: '0.8rem' }}></i>
        </div>

        <div style={{ padding: '1.25rem' }}>

          {/* Buscando */}
          {estado === 'buscando' && (
            <div className="d-flex align-items-center gap-3" style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>
              <div style={{ width: '20px', height: '20px', border: '2px solid var(--border)', borderTopColor: 'var(--gold)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }}></div>
              Buscando versión gratuita en Open Library e Internet Archive...
            </div>
          )}

          {/* PDF completo disponible */}
          {estado === 'listo' && enlacePdf && (
            <div>
              <div className="d-flex align-items-center gap-2 mb-3">
                <span style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', borderRadius: '20px', padding: '2px 12px', fontSize: '0.75rem', fontWeight: 600 }}>
                  ✓ Disponible en línea
                </span>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '0.83rem', marginBottom: '1rem' }}>
                Este libro tiene una versión de lectura gratuita a través de Internet Archive / Open Library.
              </p>
              <a
                href={enlacePdf}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'var(--gold)',
                  color: '#080b14',
                  borderRadius: '10px',
                  padding: '10px 20px',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <i className="bi bi-book-half"></i>Leer ahora
              </a>
            </div>
          )}

          {/* Solo preview */}
          {estado === 'preview' && enlacePdf && (
            <div>
              <div className="d-flex align-items-center gap-2 mb-3">
                <span style={{ background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)', color: 'var(--gold)', borderRadius: '20px', padding: '2px 12px', fontSize: '0.75rem', fontWeight: 600 }}>
                  ◐ Vista previa disponible
                </span>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '0.83rem', marginBottom: '1rem' }}>
                Solo hay una vista previa parcial disponible. Para leer el libro completo, revisa las opciones alternativas.
              </p>
              <a
                href={enlacePdf}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(244,196,48,0.15)',
                  color: 'var(--gold)',
                  border: '1px solid rgba(244,196,48,0.3)',
                  borderRadius: '10px',
                  padding: '10px 20px',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  marginBottom: '1.25rem',
                  transition: 'all 0.2s',
                }}
              >
                <i className="bi bi-eye"></i>Ver vista previa
              </a>
            </div>
          )}

          {/* Sin PDF — alternativas */}
          {(estado === 'sin_pdf' || estado === 'preview') && (
            <div style={{ marginTop: estado === 'preview' ? '0' : '0' }}>
              {estado === 'sin_pdf' && (
                <p style={{ color: 'var(--muted)', fontSize: '0.83rem', marginBottom: '1rem' }}>
                  <i className="bi bi-info-circle me-2" style={{ color: 'var(--gold)' }}></i>
                  No encontramos una versión gratuita disponible directamente. Prueba estos sitios alternativos:
                </p>
              )}
              {estado === 'preview' && (
                <p style={{ color: 'var(--muted)', fontSize: '0.78rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Alternativas para leer completo
                </p>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
                {alternativas.map(alt => (
                  <a
                    key={alt.nombre}
                    href={alt.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '10px',
                      padding: '10px 12px',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(244,196,48,0.35)'; e.currentTarget.style.background = 'rgba(244,196,48,0.05)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface)' }}
                  >
                    <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{alt.icono}</span>
                    <div>
                      <p style={{ color: 'var(--text)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '2px' }}>{alt.nombre}</p>
                      <p style={{ color: 'var(--muted)', fontSize: '0.72rem', marginBottom: 0, lineHeight: 1.3 }}>{alt.desc}</p>
                    </div>
                    <i className="bi bi-arrow-up-right ms-auto" style={{ color: 'var(--muted)', fontSize: '0.75rem', flexShrink: 0, marginTop: '2px' }}></i>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
// ────────────────────────────────────────────────────────────────────────────

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
      <div style={{
        aspectRatio: '2/3',
        borderRadius: '16px',
        background: 'linear-gradient(90deg, var(--surface) 25%, var(--surface2) 50%, var(--surface) 75%)',
        backgroundSize: '800px 100%',
        animation: 'shimmer 1.4s infinite linear'
      }} />
    </div>
    <div className="col-12 col-md-8 d-flex flex-column gap-3 pt-4">
      {[80, 50, 100, 60, 90].map((w, i) => (
        <div key={i} style={{
          height: i === 0 ? '48px' : '18px',
          width: `${w}%`,
          borderRadius: '8px',
          background: 'linear-gradient(90deg, var(--surface) 25%, var(--surface2) 50%, var(--surface) 75%)',
          backgroundSize: '800px 100%',
          animation: 'shimmer 1.4s infinite linear'
        }} />
      ))}
    </div>
  </div>
)

// [FASE 4B] Skeleton específico para la sección de sinopsis mientras carga
const SkeletonSinopsis = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
    {[100, 95, 88, 60].map((w, i) => (
      <div key={i} style={{
        height: '14px',
        width: `${w}%`,
        borderRadius: '6px',
        background: 'linear-gradient(90deg, var(--surface) 25%, var(--surface2) 50%, var(--surface) 75%)',
        backgroundSize: '800px 100%',
        animation: 'shimmer 1.4s infinite linear'
      }} />
    ))}
  </div>
)

function DetalleLibro() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [libro, setLibro]               = useState(null)
  const [cargando, setCargando]         = useState(true)
  const [cargandoSinopsis, setCargandoSinopsis] = useState(false) // [FASE 4B]
  const [portadaError, setPortadaError] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [toast, setToast]               = useState({ visible: false, mensaje: '', tipo: 'success' })

  useEffect(() => {
    // [FASE 4B] Mostramos el skeleton de sinopsis mientras el backend
    // consulta Open Library (puede tardar hasta 5s según el timeout configurado)
    setCargandoSinopsis(true)

    obtenerLibroPorId(id)
      .then(datos => setLibro(datos))
      .catch(err => { console.error('Error al cargar libro:', err); navigate('/') })
      .finally(() => {
        setCargando(false)
        setCargandoSinopsis(false) // [FASE 4B]
      })
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
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '24px',
        padding: '2.5rem',
        animation: 'slideInUp 0.4s ease both'
      }}>
        {cargando ? <SkeletonDetalle /> : libro ? (
          <div className="row g-5">

            {/* Columna izquierda */}
            <div className="col-12 col-md-4">
              <div style={{
                aspectRatio: '2/3',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid var(--border)',
                boxShadow: '-8px 12px 40px rgba(0,0,0,0.6)',
                position: 'relative'
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'var(--gold)', zIndex: 2 }} />
                {libro.isbn && !portadaError ? (
                  <img
                    src={`https://covers.openlibrary.org/b/isbn/${libro.isbn}-L.jpg`}
                    alt={`Portada de ${libro.titulo}`}
                    onError={() => setPortadaError(true)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <div style={{
                    width: '100%', height: '100%',
                    background: 'linear-gradient(160deg, var(--surface2) 0%, var(--bg) 100%)',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    gap: '0.75rem', padding: '1.5rem'
                  }}>
                    <span style={{ fontSize: '4rem', opacity: 0.3 }}>📖</span>
                    <p style={{
                      fontFamily: "'Playfair Display', serif",
                      color: 'var(--muted)', fontSize: '0.85rem',
                      textAlign: 'center', fontStyle: 'italic',
                      lineHeight: 1.4, marginBottom: 0
                    }}>{libro.titulo}</p>
                  </div>
                )}
              </div>

              {(libro.anio || libro.isbn || libro.genero) && (
                <div style={{
                  background: 'var(--surface2)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '1rem',
                  marginTop: '1.25rem',
                  display: 'flex', flexDirection: 'column', gap: '0.6rem'
                }}>
                  {libro.anio  && <div className="d-flex align-items-center gap-2"><span>📅</span><span style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>Año: <span style={{ color: 'var(--text)' }}>{libro.anio}</span></span></div>}
                  {libro.isbn  && <div className="d-flex align-items-center gap-2"><span>🌍</span><span style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>ISBN: <span style={{ color: 'var(--text)' }}>{libro.isbn}</span></span></div>}
                  {libro.genero && <div className="d-flex align-items-center gap-2"><span>📚</span><span style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>Género: <span style={{ color: 'var(--text)' }}>{libro.genero}</span></span></div>}
                </div>
              )}
            </div>

            {/* Columna derecha */}
            <div className="col-12 col-md-8">
              <div className="d-flex align-items-center gap-2 mb-3">
                <span
                  onClick={() => navigate('/')}
                  style={{ color: 'var(--muted)', fontSize: '0.82rem', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
                >Listado</span>
                <span style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>›</span>
                <span style={{ color: 'var(--text)', fontSize: '0.82rem' }}>Detalle del libro</span>
              </div>

              {libro.genero && (
                <span style={{
                  background: 'rgba(244,196,48,0.1)', color: 'var(--gold)',
                  border: '1px solid rgba(244,196,48,0.25)', borderRadius: '20px',
                  padding: '3px 14px', fontSize: '0.78rem', fontWeight: 600,
                  display: 'inline-block', marginBottom: '1rem'
                }}>
                  {libro.genero}
                </span>
              )}

              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                color: 'var(--text)',
                fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                fontWeight: 900, lineHeight: 1.15, marginBottom: '0.75rem'
              }}>
                {libro.titulo}
              </h1>

              <p style={{ color: 'var(--muted)', fontSize: '1.05rem', fontStyle: 'italic', marginBottom: '1.25rem' }}>
                <i className="bi bi-person-fill me-2"></i>{libro.autor}
              </p>

              <div className="mb-1">
                <p style={{ color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
                  Calificación personal
                </p>
                {renderEstrellas(libro.rating || 0)}
              </div>

              <div style={{ height: '1px', background: 'var(--border)', margin: '1.5rem 0' }} />

              {/* [FASE 4B] Sección sinopsis con skeleton y fuente */}
              <div className="mb-4">
                <div className="d-flex align-items-center gap-3 mb-2">
                  <p style={{
                    color: 'var(--text)', fontSize: '0.78rem', fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 0
                  }}>Sinopsis</p>
                  <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                </div>

                {cargandoSinopsis ? (
                  // Skeleton mientras llega la respuesta del backend
                  <SkeletonSinopsis />
                ) : libro.sinopsis ? (
                  <>
                    <p style={{ color: 'var(--muted)', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                      {libro.sinopsis}
                    </p>
                    {/* Fuente de la sinopsis */}
                    <p style={{ color: 'var(--muted)', fontSize: '0.72rem', opacity: 0.5, marginBottom: 0 }}>
                      <i className="bi bi-globe2 me-1"></i>Sinopsis obtenida de Open Library
                    </p>
                  </>
                ) : (
                  // Fallback cuando sinopsis es null
                  <p style={{ color: 'var(--muted)', lineHeight: 1.8, fontSize: '0.95rem', fontStyle: 'italic', opacity: 0.6 }}>
                    {libro.isbn
                      ? 'Open Library no dispone de sinopsis para este libro.'
                      : 'Añade el ISBN del libro para obtener la sinopsis automáticamente.'
                    }
                  </p>
                )}
              </div>

              <div className="d-flex flex-wrap gap-2 mb-4">
                {libro.genero && <span style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: '20px', padding: '4px 14px', fontSize: '0.78rem' }}>{libro.genero}</span>}
                {libro.anio   && <span style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: '20px', padding: '4px 14px', fontSize: '0.78rem' }}>{libro.anio}</span>}
                {libro.rating === 5 && <span style={{ background: 'rgba(244,196,48,0.1)', border: '1px solid rgba(244,196,48,0.25)', color: 'var(--gold)', borderRadius: '20px', padding: '4px 14px', fontSize: '0.78rem', fontWeight: 600 }}>★ Clásico</span>}
              </div>

              {/* ── LEER ESTE LIBRO ── */}
              <LeerLibro libro={libro} />

              {/* Botones */}
              <div className="d-flex gap-2 flex-wrap">
                <button
                  onClick={() => navigate('/')}
                  style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: '10px', padding: '9px 20px', fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.2s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}>
                  <i className="bi bi-arrow-left me-2"></i>Volver al listado
                </button>

                <button
                  onClick={() => setModalVisible(true)}
                  style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--red-acc)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '9px 20px', fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.2s ease' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.25)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}>
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