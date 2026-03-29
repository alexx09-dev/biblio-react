import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { crearLibro } from '../api/libros'
import Toast from '../componentes/Toast'

const GENEROS = [
  'Terror', 'Juvenil', 'Historia', 'Ciencia Ficción',
  'Romance', 'Bélico', 'Misterio', 'Biografía', 'Filosofía', 'Otro',
]

const estiloInput = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  color: 'var(--text)',
  padding: '10px 14px',
  width: '100%',
  outline: 'none',
  fontSize: '0.92rem',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
}

const estiloLabel = {
  color: 'var(--muted)',
  fontSize: '0.72rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: '6px',
  display: 'block',
}

function AgregarLibro() {
  const navigate = useNavigate()

  const [titulo,   setTitulo]   = useState('')
  const [autor,    setAutor]    = useState('')
  const [isbn,     setIsbn]     = useState('')
  const [genero,   setGenero]   = useState('')
  const [anio,     setAnio]     = useState('')
  const [rating,   setRating]   = useState(0)
  const [sinopsis, setSinopsis] = useState('') // ← NUEVO

  const [hoverRating,  setHoverRating]  = useState(0)
  const [urlPortada,   setUrlPortada]   = useState('')
  const [portadaError, setPortadaError] = useState(false)
  const [enviando,     setEnviando]     = useState(false)

  const [toast, setToast] = useState({ visible: false, mensaje: '', tipo: 'success' })
  const mostrarToast = (mensaje, tipo = 'success') => setToast({ visible: true, mensaje, tipo })
  const cerrarToast  = () => setToast(prev => ({ ...prev, visible: false }))

  useEffect(() => {
    if (isbn.trim()) {
      setPortadaError(false)
      setUrlPortada(`https://covers.openlibrary.org/b/isbn/${isbn.trim()}-L.jpg`)
    } else {
      setUrlPortada('')
    }
  }, [isbn])

  const handleFocusInput = (e) => {
    e.target.style.borderColor = 'var(--gold)'
    e.target.style.boxShadow   = '0 0 0 3px rgba(244,196,48,0.1)'
  }
  const handleBlurInput = (e) => {
    e.target.style.borderColor = 'rgba(255,255,255,0.1)'
    e.target.style.boxShadow   = 'none'
  }

  const handleSubmit = async () => {
    setEnviando(true)
    try {
      await crearLibro({ titulo, autor, isbn, genero, anio, rating, sinopsis }) // ← sinopsis agregado
      mostrarToast('¡Libro agregado exitosamente!', 'success')
      setTimeout(() => navigate('/'), 1200)
    } catch (error) {
      mostrarToast(error.message || 'Error al guardar el libro.', 'danger')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="container py-4" style={{ maxWidth: '900px' }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '20px', padding: '2.5rem', animation: 'slideInUp 0.4s ease both' }}>

        <div className="mb-4">
          <h2 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--gold)', fontSize: '2rem', fontWeight: 900, marginBottom: '0.25rem' }}>
            <i className="bi bi-plus-circle-fill me-2"></i>Agregar Libro
          </h2>
          <p style={{ color: 'var(--muted)', marginBottom: 0 }}>Completa los datos para añadir un nuevo libro a tu colección.</p>
        </div>

        <div className="row g-4">
          {/* Columna izquierda — Preview portada */}
          <div className="col-12 col-md-4">
            <div style={{ aspectRatio: '2/3', borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--border)', background: 'var(--surface2)', position: 'relative' }}>
              {urlPortada && !portadaError ? (
                <img src={urlPortada} alt="Previsualización" onError={() => setPortadaError(true)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'opacity 0.3s ease' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '1.5rem', background: 'linear-gradient(160deg, var(--surface2) 0%, var(--bg) 100%)' }}>
                  <span style={{ fontSize: '3.5rem', opacity: 0.4 }}>📖</span>
                  <p style={{ color: 'var(--muted)', fontSize: '0.78rem', textAlign: 'center', lineHeight: 1.5, marginBottom: 0 }}>La portada se actualizará al ingresar el ISBN</p>
                </div>
              )}
            </div>
          </div>

          {/* Columna derecha — Campos */}
          <div className="col-12 col-md-8">
            <div className="d-flex flex-column gap-3">

              <div>
                <label style={estiloLabel}>Título *</label>
                <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Ej: Cien años de soledad" style={estiloInput} onFocus={handleFocusInput} onBlur={handleBlurInput} />
              </div>

              <div>
                <label style={estiloLabel}>Autor *</label>
                <input type="text" value={autor} onChange={e => setAutor(e.target.value)} placeholder="Ej: Gabriel García Márquez" style={estiloInput} onFocus={handleFocusInput} onBlur={handleBlurInput} />
              </div>

              <div>
                <label style={estiloLabel}>ISBN</label>
                <input type="text" value={isbn} onChange={e => setIsbn(e.target.value)} placeholder="Ej: 9780451524935" style={estiloInput} onFocus={handleFocusInput} onBlur={handleBlurInput} />
                <p style={{ color: 'var(--muted)', fontSize: '0.72rem', marginTop: '5px', marginBottom: 0 }}>
                  <i className="bi bi-info-circle me-1"></i>Ingresa el ISBN para cargar la portada automáticamente.
                </p>
              </div>

              <div className="row g-3">
                <div className="col-7">
                  <label style={estiloLabel}>Género</label>
                  <select value={genero} onChange={e => setGenero(e.target.value)} style={{ ...estiloInput, backgroundColor: 'var(--surface2)' }} onFocus={handleFocusInput} onBlur={handleBlurInput}>
                    <option value="" style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>Seleccionar...</option>
                    {GENEROS.map(g => <option key={g} value={g} style={{ background: 'var(--surface2)', color: 'var(--text)' }}>{g}</option>)}
                  </select>
                </div>
                <div className="col-5">
                  <label style={estiloLabel}>Año</label>
                  <input type="number" value={anio} onChange={e => setAnio(e.target.value)} placeholder="Ej: 1967" min="1000" max="2099" style={estiloInput} onFocus={handleFocusInput} onBlur={handleBlurInput} />
                </div>
              </div>

              {/* ← NUEVO: Sinopsis */}
              <div>
                <label style={estiloLabel}>Sinopsis</label>
                <textarea
                  value={sinopsis}
                  onChange={e => setSinopsis(e.target.value)}
                  placeholder="Escribe una breve descripción del libro..."
                  rows={4}
                  style={{ ...estiloInput, resize: 'vertical', lineHeight: 1.6 }}
                  onFocus={handleFocusInput}
                  onBlur={handleBlurInput}
                />
              </div>

              <div>
                <label style={estiloLabel}>Calificación *</label>
                <div className="d-flex gap-1">
                  {[1,2,3,4,5].map(n => (
                    <span key={n} onClick={() => setRating(n)} onMouseEnter={() => setHoverRating(n)} onMouseLeave={() => setHoverRating(0)}
                      style={{ fontSize: '2rem', cursor: 'pointer', color: n <= (hoverRating || rating) ? 'var(--gold)' : 'var(--muted)', transition: 'color 0.15s ease, transform 0.15s ease', transform: n <= (hoverRating || rating) ? 'scale(1.15)' : 'scale(1)', lineHeight: 1 }}>★</span>
                  ))}
                </div>
                {rating > 0 && <p style={{ color: 'var(--muted)', fontSize: '0.78rem', marginTop: '4px', marginBottom: 0 }}>{['','Malo','Regular','Bueno','Muy bueno','Excelente'][rating]}</p>}
              </div>

              <div className="d-flex gap-3 mt-2">
                <button onClick={handleSubmit} disabled={enviando}
                  style={{ flex: 1, background: 'var(--gold)', color: '#080b14', border: 'none', borderRadius: '10px', padding: '11px', fontWeight: 700, fontSize: '0.92rem', cursor: enviando ? 'not-allowed' : 'pointer', opacity: enviando ? 0.75 : 1 }}>
                  {enviando ? <><span className="spinner-border spinner-border-sm me-2" />Guardando...</> : <><i className="bi bi-check-lg me-2"></i>Guardar Libro</>}
                </button>
                <button onClick={() => navigate('/')} disabled={enviando}
                  style={{ flex: 1, background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: '10px', padding: '11px', fontWeight: 500, fontSize: '0.92rem', cursor: 'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--muted)'; e.currentTarget.style.color = 'var(--text)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}>
                  <i className="bi bi-x-lg me-2"></i>Cancelar
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      <Toast visible={toast.visible} mensaje={toast.mensaje} tipo={toast.tipo} onClose={cerrarToast} />
    </div>
  )
}

export default AgregarLibro