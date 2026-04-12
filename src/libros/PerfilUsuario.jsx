// src/libros/PerfilUsuario.jsx
import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexto/AuthContext'
import { obtenerPerfil } from '../api/auth'
import { listarLibros } from '../api/libros'

const renderEstrellas = (rating) => {
  const llenas = Math.round(rating)
  const vacias = 5 - llenas
  return (
    <span style={{ color: 'var(--gold)', fontSize: '0.9rem' }}>
      {'★'.repeat(llenas)}{'☆'.repeat(vacias)}
    </span>
  )
}

const FallbackPortada = ({ titulo }) => (
  <div style={{
    width: '100%', height: '100%',
    background: 'linear-gradient(160deg, var(--surface2) 0%, var(--bg) 100%)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    gap: '0.4rem', padding: '0.5rem',
  }}>
    <span style={{ fontSize: '1.4rem' }}>📖</span>
    <p style={{
      fontFamily: "'Playfair Display', serif",
      color: 'var(--muted)', fontSize: '0.6rem',
      textAlign: 'center', fontStyle: 'italic',
      lineHeight: 1.3, marginBottom: 0,
      overflow: 'hidden', display: '-webkit-box',
      WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
    }}>{titulo}</p>
  </div>
)

function PerfilUsuario() {
  const navigate = useNavigate()
  const { usuario: usuarioCtx, login } = useAuth()

  const [usuario, setUsuario]           = useState(usuarioCtx)
  const [libros, setLibros]             = useState([])
  const [cargando, setCargando]         = useState(true)
  const [portadasError, setPortadasError] = useState({})

  useEffect(() => {
    const cargar = async () => {
      try {
        const [perfil, misLibros] = await Promise.all([
          obtenerPerfil(),
          listarLibros(),
        ])
        setUsuario(perfil)
        setLibros(misLibros)
        // Actualizar el contexto con datos frescos del servidor
        const token = localStorage.getItem('token')
        login(token, perfil)
      } catch (err) {
        console.error('Error al cargar perfil:', err)
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  const stats = useMemo(() => {
    if (!libros.length) return { total: 0, ratingPromedio: '—', generosUnicos: 0, autoresUnicos: 0 }
    const ratingPromedio = (libros.reduce((acc, l) => acc + (l.rating || 0), 0) / libros.length).toFixed(1)
    return {
      total: libros.length,
      ratingPromedio,
      generosUnicos: new Set(libros.map(l => l.genero).filter(Boolean)).size,
      autoresUnicos:  new Set(libros.map(l => l.autor).filter(Boolean)).size,
    }
  }, [libros])

  const generosFavoritos = usuario?.generos_favoritos
    ? usuario.generos_favoritos.split(',').map(g => g.trim()).filter(Boolean)
    : []

  const iniciales = usuario?.nombre
    ? usuario.nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return null
    try {
      return new Date(fechaStr).toLocaleDateString('es-MX', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    } catch { return fechaStr }
  }

  if (cargando) {
    return (
      <div className="container py-5" style={{ maxWidth: '900px' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '24px', padding: '2.5rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(90deg, var(--surface) 25%, var(--surface2) 50%, var(--surface) 75%)', backgroundSize: '800px 100%', animation: 'shimmer 1.4s infinite linear' }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[60, 40].map((w, i) => (
                <div key={i} style={{ height: i === 0 ? '22px' : '14px', width: `${w}%`, borderRadius: '6px', background: 'linear-gradient(90deg, var(--surface) 25%, var(--surface2) 50%, var(--surface) 75%)', backgroundSize: '800px 100%', animation: 'shimmer 1.4s infinite linear' }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-4" style={{ maxWidth: '900px', animation: 'fadeInUp 0.4s ease both' }}>

      {/* ── CARD PRINCIPAL ── */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '24px', overflow: 'hidden', marginBottom: '1.5rem' }}>

        {/* Banner decorativo */}
        <div style={{
          height: '100px',
          background: 'linear-gradient(135deg, rgba(244,196,48,0.15) 0%, rgba(244,196,48,0.03) 60%, transparent 100%)',
          borderBottom: '1px solid var(--border)',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(244,196,48,0.03) 20px, rgba(244,196,48,0.03) 40px)`,
          }} />
        </div>

        <div style={{ padding: '0 2rem 2rem', position: 'relative' }}>

          {/* Avatar */}
          <div style={{
            width: '86px', height: '86px',
            borderRadius: '50%',
            border: '4px solid var(--surface)',
            background: usuario?.foto_perfil ? 'transparent' : 'var(--gold)',
            backgroundImage: usuario?.foto_perfil ? `url(${usuario.foto_perfil})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '1.5rem', color: '#080b14',
            marginTop: '-43px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}>
            {!usuario?.foto_perfil && iniciales}
          </div>

          <div className="row align-items-start g-3 mt-1">
            <div className="col-12 col-md-8">
              <h2 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text)', fontWeight: 900, fontSize: '1.75rem', marginBottom: '0.2rem' }}>
                {usuario?.nombre}
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                <i className="bi bi-envelope me-2"></i>{usuario?.email}
              </p>

              {usuario?.fecha_nacimiento && (
                <p style={{ color: 'var(--muted)', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
                  <i className="bi bi-calendar3 me-2"></i>
                  Nacimiento: <span style={{ color: 'var(--text)' }}>{formatearFecha(usuario.fecha_nacimiento)}</span>
                </p>
              )}

              {usuario?.bio && (
                <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.6, marginTop: '0.75rem', fontStyle: 'italic' }}>
                  "{usuario.bio}"
                </p>
              )}

              {/* Géneros favoritos */}
              {generosFavoritos.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mt-3">
                  <span style={{ color: 'var(--muted)', fontSize: '0.78rem', alignSelf: 'center' }}>
                    <i className="bi bi-heart-fill me-1" style={{ color: 'var(--gold)' }}></i>
                    Géneros favoritos:
                  </span>
                  {generosFavoritos.map(g => (
                    <span key={g} style={{
                      background: 'rgba(244,196,48,0.1)', color: 'var(--gold)',
                      border: '1px solid rgba(244,196,48,0.25)',
                      borderRadius: '20px', padding: '2px 10px', fontSize: '0.75rem',
                    }}>{g}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Stats mini */}
            <div className="col-12 col-md-4">
              <div style={{
                background: 'var(--surface2)', border: '1px solid var(--border)',
                borderRadius: '14px', padding: '1rem',
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem',
              }}>
                {[
                  { val: stats.total,          lbl: 'Libros',    icon: 'bi-collection-fill' },
                  { val: stats.ratingPromedio + ' ★', lbl: 'Rating',   icon: 'bi-star-fill' },
                  { val: stats.generosUnicos,  lbl: 'Géneros',   icon: 'bi-bookmark-fill' },
                  { val: stats.autoresUnicos,  lbl: 'Autores',   icon: 'bi-people-fill' },
                ].map(({ val, lbl, icon }) => (
                  <div key={lbl} style={{ textAlign: 'center' }}>
                    <i className={`bi ${icon}`} style={{ color: 'var(--gold)', fontSize: '0.8rem', display: 'block', marginBottom: '2px' }}></i>
                    <div style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '1.15rem', lineHeight: 1 }}>{val}</div>
                    <div style={{ color: 'var(--muted)', fontSize: '0.7rem', marginTop: '2px' }}>{lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── COLECCIÓN ── */}
      <div>
        <div className="d-flex align-items-center gap-3 mb-3">
          <h4 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--gold)', fontWeight: 800, marginBottom: 0 }}>
            <i className="bi bi-collection-fill me-2"></i>Mi Colección
          </h4>
          <span style={{ background: 'rgba(244,196,48,0.1)', color: 'var(--gold)', border: '1px solid rgba(244,196,48,0.2)', borderRadius: '20px', padding: '1px 10px', fontSize: '0.78rem' }}>
            {libros.length} {libros.length === 1 ? 'libro' : 'libros'}
          </span>
          <button
            onClick={() => navigate('/')}
            style={{ marginLeft: 'auto', background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: '8px', padding: '5px 14px', cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}
          >
            Ver colección completa
          </button>
        </div>

        {libros.length === 0 ? (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '20px', padding: '3rem', textAlign: 'center' }}>
            <span style={{ fontSize: '3rem', opacity: 0.3 }}>📚</span>
            <p style={{ color: 'var(--muted)', marginTop: '1rem' }}>Tu colección está vacía.</p>
            <button
              onClick={() => navigate('/buscar')}
              style={{ background: 'var(--gold)', border: 'none', color: '#080b14', borderRadius: '8px', padding: '8px 20px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}
            >
              Buscar libros
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: '1rem',
          }}>
            {libros.map((libro, i) => (
              <div
                key={libro.id}
                onClick={() => navigate(`/libros/${libro.id}`)}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                  animation: 'fadeInUp 0.4s ease both',
                  animationDelay: `${i * 0.04}s`,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.4)'
                  e.currentTarget.style.borderColor = 'rgba(244,196,48,0.35)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.borderColor = 'var(--border)'
                }}
              >
                {/* Portada */}
                <div style={{ aspectRatio: '2/3', overflow: 'hidden' }}>
                  {libro.isbn && !portadasError[libro.id] ? (
                    <img
                      src={`https://covers.openlibrary.org/b/isbn/${libro.isbn}-L.jpg`}
                      alt={libro.titulo}
                      onError={() => setPortadasError(prev => ({ ...prev, [libro.id]: true }))}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <FallbackPortada titulo={libro.titulo} />
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: '8px 10px' }}>
                  <p style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text)', fontSize: '0.75rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '2px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {libro.titulo}
                  </p>
                  <p style={{ color: 'var(--muted)', fontSize: '0.65rem', marginBottom: '4px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                    {libro.autor}
                  </p>
                  {renderEstrellas(libro.rating || 0)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PerfilUsuario