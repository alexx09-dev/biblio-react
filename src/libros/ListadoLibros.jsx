import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { listarLibros } from '../api/libros'
import HeroColeccion from '../componentes/HeroColeccion'
import Toast from '../componentes/Toast'

const renderEstrellas = (rating) => {
  const llenas = Math.round(rating)
  const vacias = 5 - llenas
  return (
    <span style={{ color: 'var(--gold)', fontSize: '0.95rem' }}>
      {'★'.repeat(llenas)}{'☆'.repeat(vacias)}
    </span>
  )
}

const SkeletonCard = () => (
  <div className="col">
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
      <div style={{ aspectRatio: '2/3', background: 'linear-gradient(90deg, var(--surface) 25%, var(--surface2) 50%, var(--surface) 75%)', backgroundSize: '800px 100%', animation: 'shimmer 1.4s infinite linear' }} />
      <div className="p-3">
        <div style={{ height: '18px', borderRadius: '6px', marginBottom: '10px', background: 'linear-gradient(90deg, var(--surface) 25%, var(--surface2) 50%, var(--surface) 75%)', backgroundSize: '800px 100%', animation: 'shimmer 1.4s infinite linear' }} />
        <div style={{ height: '13px', width: '70%', borderRadius: '6px', marginBottom: '16px', background: 'linear-gradient(90deg, var(--surface) 25%, var(--surface2) 50%, var(--surface) 75%)', backgroundSize: '800px 100%', animation: 'shimmer 1.4s infinite linear' }} />
      </div>
    </div>
  </div>
)

const FallbackPortada = ({ titulo }) => (
  <div style={{ aspectRatio: '2/3', background: 'linear-gradient(160deg, var(--surface2) 0%, var(--bg) 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', gap: '0.75rem' }}>
    <span style={{ fontSize: '2.8rem' }}>📖</span>
    <p style={{ fontFamily: "'Playfair Display', serif", color: 'var(--muted)', fontSize: '0.8rem', textAlign: 'center', fontStyle: 'italic', lineHeight: 1.4 }}>
      {titulo}
    </p>
  </div>
)

const Chip = ({ label, activo, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: '5px 14px',
      borderRadius: '20px',
      border: activo ? '1px solid var(--gold)' : '1px solid var(--border)',
      background: activo ? 'var(--gold)' : 'transparent',
      color: activo ? '#080b14' : 'var(--muted)',
      fontWeight: activo ? 700 : 400,
      fontSize: '0.82rem',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      transition: 'all 0.2s ease',
    }}
  >
    {label}
  </button>
)

function ListadoLibros({ busqueda = '' }) {
  const navigate = useNavigate()
  const [libros, setLibros]               = useState([])
  const [cargando, setCargando]           = useState(true)
  const [portadasError, setPortadasError] = useState({})
  const [generoActivo, setGeneroActivo]   = useState(null)
  const [autorActivo, setAutorActivo]     = useState(null)

  const [toast, setToast] = useState({ visible: false, mensaje: '', tipo: 'success' })

  const mostrarToast = (mensaje, tipo = 'success') => {
    setToast({ visible: true, mensaje, tipo })
  }

  const cerrarToast = () => {
    setToast(prev => ({ ...prev, visible: false }))
  }

  useEffect(() => {
    setCargando(true)
    listarLibros(null, busqueda || null)
      .then(datos => setLibros(datos))
      .catch(err => console.error('Error al cargar libros:', err))
      .finally(() => setCargando(false))
  }, [busqueda])

  const handleImageError = (id) => {
    setPortadasError(prev => ({ ...prev, [id]: true }))
  }

  const generosUnicos = useMemo(() =>
    [...new Set(libros.map(l => l.genero).filter(Boolean))].sort()
  , [libros])

  const autoresUnicos = useMemo(() =>
    [...new Set(libros.map(l => l.autor).filter(Boolean))].sort()
  , [libros])

  const generoDestacado = useMemo(() => {
    if (libros.length < 2) return null
    const conteo = {}
    libros.forEach(l => {
      if (l.genero) conteo[l.genero] = (conteo[l.genero] || 0) + 1
    })
    const top = Object.entries(conteo).sort((a, b) => b[1] - a[1])[0]
    if (!top || top[1] < 2) return null
    return {
      genero: top[0],
      libros: libros.filter(l => l.genero === top[0]),
    }
  }, [libros])

  const librosFiltrados = useMemo(() => {
    let resultado = libros
    if (generoActivo) resultado = resultado.filter(l => l.genero === generoActivo)
    if (autorActivo)  resultado = resultado.filter(l => l.autor  === autorActivo)
    return resultado
  }, [libros, generoActivo, autorActivo])

  const stats = useMemo(() => {
    if (!libros.length) return null
    const ratingPromedio = (libros.reduce((acc, l) => acc + (l.rating || 0), 0) / libros.length).toFixed(1)
    return {
      total: libros.length,
      ratingPromedio,
      generosUnicos: generosUnicos.length,
      autoresUnicos: autoresUnicos.length,
    }
  }, [libros, generosUnicos, autoresUnicos])

  return (
    <div className="container py-4">

      {/* Encabezado */}
      <div className="mb-4">
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--gold)', fontSize: '2.2rem', fontWeight: 900 }}>
          <i className="bi bi-collection-fill me-2"></i>
          Mi Colección
        </h2>
        <p style={{ color: 'var(--muted)', marginTop: '0.25rem' }}>
          Explora, filtra y gestiona todos tus libros en un solo lugar.
        </p>
      </div>

      {/* Stats bar */}
      {!cargando && stats && (
        <div className="d-flex flex-wrap gap-3 mb-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1rem 1.5rem' }}>
          <div className="text-center px-3">
            <div style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '1.4rem' }}>{stats.total}</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>Libros</div>
          </div>
          <div style={{ width: '1px', background: 'var(--border)' }} />
          <div className="text-center px-3">
            <div style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '1.4rem' }}>{stats.ratingPromedio} ★</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>Rating promedio</div>
          </div>
          <div style={{ width: '1px', background: 'var(--border)' }} />
          <div className="text-center px-3">
            <div style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '1.4rem' }}>{stats.generosUnicos}</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>Géneros</div>
          </div>
          <div style={{ width: '1px', background: 'var(--border)' }} />
          <div className="text-center px-3">
            <div style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '1.4rem' }}>{stats.autoresUnicos}</div>
            <div style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>Autores</div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      {!cargando && generoDestacado && (
        <HeroColeccion
          genero={generoDestacado.genero}
          libros={generoDestacado.libros}
        />
      )}

      {/* Tabs de filtrado */}
      {!cargando && libros.length > 0 && (
        <div className="mb-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {generosUnicos.length > 0 && (
            <div>
              <p style={{ color: 'var(--muted)', fontSize: '0.75rem', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Géneros</p>
              <div className="d-flex flex-wrap gap-2">
                <Chip label="Todos" activo={!generoActivo} onClick={() => setGeneroActivo(null)} />
                {generosUnicos.map(g => (
                  <Chip key={g} label={g} activo={generoActivo === g} onClick={() => setGeneroActivo(generoActivo === g ? null : g)} />
                ))}
              </div>
            </div>
          )}
          {autoresUnicos.length > 0 && (
            <div>
              <p style={{ color: 'var(--muted)', fontSize: '0.75rem', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Autores</p>
              <div className="d-flex flex-wrap gap-2">
                <Chip label="Todos" activo={!autorActivo} onClick={() => setAutorActivo(null)} />
                {autoresUnicos.map(a => (
                  <Chip key={a} label={a} activo={autorActivo === a} onClick={() => setAutorActivo(autorActivo === a ? null : a)} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Grid skeleton */}
      {cargando && (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Grid de cards — toda la card es clickeable */}
      {!cargando && librosFiltrados.length > 0 && (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
          {librosFiltrados.map((libro, index) => (
            <div key={libro.id} className="col" style={{ animation: 'fadeInUp 0.5s ease both', animationDelay: `${index * 0.07}s` }}>
              <div
                className="h-100"
                onClick={() => navigate(`/libros/${libro.id}`)}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px) scale(1.01)'
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.5)'
                  e.currentTarget.style.borderColor = 'rgba(244,196,48,0.4)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.borderColor = 'var(--border)'
                }}
              >
                {/* Portada */}
                <div style={{ position: 'relative', aspectRatio: '2/3', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 2, background: 'rgba(8,11,20,0.7)', backdropFilter: 'blur(6px)', color: 'var(--muted)', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '20px', border: '1px solid var(--border)' }}>
                    #{String(libro.id).padStart(3, '0')}
                  </div>
                  {libro.isbn && !portadasError[libro.id] ? (
                    <img
                      src={`https://covers.openlibrary.org/b/isbn/${libro.isbn}-L.jpg`}
                      alt={`Portada de ${libro.titulo}`}
                      onError={() => handleImageError(libro.id)}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <FallbackPortada titulo={libro.titulo} />
                  )}
                  <div
                    style={{ position: 'absolute', inset: 0, background: 'rgba(8,11,20,0.82)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.25s ease' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0}
                  >
                    <span style={{ color: 'var(--gold)', fontSize: '2rem' }}>
                      {'★'.repeat(Math.round(libro.rating || 0))}
                    </span>
                  </div>
                </div>

                {/* Cuerpo */}
                <div className="p-3 d-flex flex-column" style={{ gap: '0.4rem' }}>
                  <h6 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text)', fontWeight: 700, marginBottom: 0, lineHeight: 1.3 }}>
                    {libro.titulo}
                  </h6>
                  <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: 0 }}>
                    <i className="bi bi-person-fill me-1"></i>{libro.autor}
                  </p>
                  {libro.anio && (
                    <p style={{ color: 'var(--muted)', fontSize: '0.75rem', marginBottom: 0 }}>{libro.anio}</p>
                  )}
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    {libro.genero && (
                      <span style={{ background: 'rgba(244,196,48,0.1)', color: 'var(--gold)', border: '1px solid rgba(244,196,48,0.2)', borderRadius: '20px', padding: '1px 10px', fontSize: '0.72rem' }}>
                        {libro.genero}
                      </span>
                    )}
                    {renderEstrellas(libro.rating || 0)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sin resultados */}
      {!cargando && libros.length > 0 && librosFiltrados.length === 0 && (
        <div className="text-center py-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '20px' }}>
          <i className="bi bi-funnel" style={{ fontSize: '3rem', color: 'var(--gold)', opacity: 0.35 }}></i>
          <h5 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text)', marginTop: '1rem' }}>Sin resultados</h5>
          <p style={{ color: 'var(--muted)' }}>No hay libros que coincidan con los filtros activos.</p>
          <button
            onClick={() => { setGeneroActivo(null); setAutorActivo(null) }}
            style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: '8px', padding: '6px 16px', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            Limpiar filtros
          </button>
        </div>
      )}

      {/* Colección vacía */}
      {!cargando && libros.length === 0 && (
        <div className="text-center py-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '20px' }}>
          <i className="bi bi-book-half" style={{ fontSize: '3.5rem', color: 'var(--gold)', opacity: 0.35 }}></i>
          <h5 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text)', marginTop: '1rem' }}>Tu colección está vacía</h5>
          <p style={{ color: 'var(--muted)' }}>Agrega tu primer libro para comenzar.</p>
        </div>
      )}

      <Toast
        visible={toast.visible}
        mensaje={toast.mensaje}
        tipo={toast.tipo}
        onClose={cerrarToast}
      />

    </div>
  )
}

export default ListadoLibros
