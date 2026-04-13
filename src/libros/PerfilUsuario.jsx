// src/libros/PerfilUsuario.jsx
import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexto/AuthContext'
import { obtenerPerfil, obtenerStats } from '../api/auth'
import { listarLibros, toggleFavorito } from '../api/libros'

const Estrellas = ({ rating, size = '0.85rem' }) => {
  const llenas = Math.round(rating)
  return (
    <span style={{ color: 'var(--gold)', fontSize: size }}>
      {'★'.repeat(llenas)}{'☆'.repeat(5 - llenas)}
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

function LibroCard({ libro, onToggleFav, portadaError, onPortadaError }) {
  const navigate = useNavigate()
  const [cargando, setCargando] = useState(false)

  const handleFav = async (e) => {
    e.stopPropagation()
    if (cargando) return
    setCargando(true)
    try {
      await onToggleFav(libro.id, !libro.es_favorito)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div
      onClick={() => navigate(`/libros/${libro.id}`)}
      style={{
        background: 'var(--surface)',
        border: `1px solid ${libro.es_favorito ? 'rgba(244,196,48,0.4)' : 'var(--border)'}`,
        borderRadius: '12px', overflow: 'hidden',
        cursor: 'pointer', position: 'relative',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.4)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
    >
      <button
        onClick={handleFav}
        title={libro.es_favorito ? 'Quitar de favoritos' : 'Marcar como favorito'}
        style={{
          position: 'absolute', top: '6px', right: '6px', zIndex: 3,
          background: libro.es_favorito ? 'rgba(244,196,48,0.9)' : 'rgba(8,11,20,0.7)',
          border: 'none', borderRadius: '50%',
          width: '28px', height: '28px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: cargando ? 'default' : 'pointer',
          fontSize: '0.85rem', backdropFilter: 'blur(4px)',
          transition: 'all 0.2s ease', opacity: cargando ? 0.5 : 1,
        }}
      >
        {libro.es_favorito ? '★' : '☆'}
      </button>

      <div style={{ aspectRatio: '2/3', overflow: 'hidden' }}>
        {libro.isbn && !portadaError ? (
          <img
            src={`https://covers.openlibrary.org/b/isbn/${libro.isbn}-L.jpg`}
            alt={libro.titulo}
            onError={onPortadaError}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <FallbackPortada titulo={libro.titulo} />
        )}
      </div>

      <div style={{ padding: '8px 10px' }}>
        <p style={{
          fontFamily: "'Playfair Display', serif",
          color: 'var(--text)', fontSize: '0.75rem', fontWeight: 700,
          lineHeight: 1.3, marginBottom: '2px',
          overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>{libro.titulo}</p>
        <p style={{ color: 'var(--muted)', fontSize: '0.65rem', marginBottom: '4px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {libro.autor}
        </p>
        <Estrellas rating={libro.rating || 0} />
      </div>
    </div>
  )
}

function PerfilUsuario() {
  const navigate = useNavigate()
  const { usuario: usuarioCtx, login } = useAuth()

  const [usuario, setUsuario]             = useState(usuarioCtx)
  const [stats, setStats]                 = useState(null)
  const [libros, setLibros]               = useState([])
  const [cargando, setCargando]           = useState(true)
  const [portadasError, setPortadasError] = useState({})
  const [vistaActiva, setVistaActiva]     = useState('favoritos')

  useEffect(() => {
    const cargar = async () => {
      try {
        const [perfil, statsData, misLibros] = await Promise.all([
          obtenerPerfil(),
          obtenerStats(),
          listarLibros(),
        ])
        setUsuario(perfil)
        setStats(statsData)
        setLibros(misLibros)
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

  const handleToggleFav = async (id, nuevoValor) => {
    await toggleFavorito(id, nuevoValor)
    setLibros(prev => prev.map(l => l.id === id ? { ...l, es_favorito: nuevoValor } : l))
  }

  const librosFavoritos = useMemo(() => libros.filter(l => l.es_favorito), [libros])
  const librosVisibles  = vistaActiva === 'favoritos' ? librosFavoritos : libros

  const generosFavoritos = usuario?.generos_favoritos
    ? usuario.generos_favoritos.split(',').map(g => g.trim()).filter(Boolean)
    : []

  const iniciales = usuario?.nombre
    ? usuario.nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return null
    try {
      return new Date(fechaStr + 'T00:00:00').toLocaleDateString('es-MX', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    } catch { return fechaStr }
  }

  if (cargando) {
    return (
      <div className="container py-5" style={{ maxWidth: '900px' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '24px', padding: '2.5rem' }}>
          <div className="d-flex gap-3 align-items-center mb-4">
            <div style={{ width: '86px', height: '86px', borderRadius: '50%', background: 'linear-gradient(90deg, var(--surface) 25%, var(--surface2) 50%, var(--surface) 75%)', backgroundSize: '800px 100%', animation: 'shimmer 1.4s infinite linear', flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[55, 38, 45].map((w, i) => (
                <div key={i} style={{ height: i === 0 ? '24px' : '14px', width: `${w}%`, borderRadius: '6px', background: 'linear-gradient(90deg, var(--surface) 25%, var(--surface2) 50%, var(--surface) 75%)', backgroundSize: '800px 100%', animation: 'shimmer 1.4s infinite linear' }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-4" style={{ maxWidth: '960px', animation: 'fadeInUp 0.4s ease both' }}>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '24px', overflow: 'hidden', marginBottom: '1.5rem' }}>

        <div style={{
          height: '90px',
          backgroundImage: `
            linear-gradient(135deg, rgba(244,196,48,0.12) 0%, rgba(244,196,48,0.02) 100%),
            repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(244,196,48,0.025) 20px, rgba(244,196,48,0.025) 40px)
          `,
          borderBottom: '1px solid var(--border)',
        }} />

        <div style={{ padding: '0 2rem 2rem' }}>
          <div style={{
            width: '86px', height: '86px', borderRadius: '50%',
            border: '4px solid var(--surface)',
            background: usuario?.foto_perfil ? 'transparent' : 'var(--gold)',
            backgroundImage: usuario?.foto_perfil ? `url(${usuario.foto_perfil})` : 'none',
            backgroundSize: 'cover', backgroundPosition: 'center',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: '1.5rem', color: '#080b14',
            marginTop: '-43px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', flexShrink: 0,
          }}>
            {!usuario?.foto_perfil && iniciales}
          </div>

          <div className="row align-items-start g-3 mt-1">
            <div className="col-12 col-md-7">
              <h2 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text)', fontWeight: 900, fontSize: '1.7rem', marginBottom: '0.25rem' }}>
                {usuario?.nombre}
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: '0.4rem' }}>
                <i className="bi bi-envelope me-2"></i>{usuario?.email}
              </p>
              {usuario?.fecha_nacimiento && (
                <p style={{ color: 'var(--muted)', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
                  <i className="bi bi-calendar3 me-2"></i>
                  Nacimiento: <span style={{ color: 'var(--text)', fontWeight: 500 }}>{formatearFecha(usuario.fecha_nacimiento)}</span>
                </p>
              )}
              {usuario?.bio && (
                <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.6, marginTop: '0.5rem', fontStyle: 'italic', borderLeft: '2px solid rgba(244,196,48,0.3)', paddingLeft: '0.75rem' }}>
                  {usuario.bio}
                </p>
              )}
              {generosFavoritos.length > 0 && (
                <div className="d-flex flex-wrap align-items-center gap-2 mt-3">
                  <span style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>
                    <i className="bi bi-heart-fill me-1" style={{ color: 'var(--gold)' }}></i>Le gusta:
                  </span>
                  {generosFavoritos.map(g => (
                    <span key={g} style={{ background: 'rgba(244,196,48,0.1)', color: 'var(--gold)', border: '1px solid rgba(244,196,48,0.25)', borderRadius: '20px', padding: '2px 10px', fontSize: '0.73rem' }}>{g}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="col-12 col-md-5">
              <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  { val: stats?.total_libros ?? 0, lbl: 'Libros', icon: 'bi-collection-fill' },
                  { val: stats?.total_libros > 0 ? `${stats.rating_promedio} ★` : '— ★', lbl: 'Rating', icon: 'bi-star-fill' },
                  { val: stats?.generos_unicos ?? 0, lbl: 'Géneros', icon: 'bi-bookmark-fill' },
                  { val: stats?.autores_unicos ?? 0, lbl: 'Autores', icon: 'bi-people-fill' },
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

      <div>
        <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
          <h4 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--gold)', fontWeight: 800, marginBottom: 0 }}>
            <i className="bi bi-collection-fill me-2"></i>Mi Colección
          </h4>
          <div style={{ display: 'flex', gap: '6px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '10px', padding: '4px' }}>
            {[
              { id: 'favoritos', label: `⭐ Favoritos (${librosFavoritos.length})` },
              { id: 'todos',     label: `Todos (${libros.length})` },
            ].map(tab => (
              <button key={tab.id} onClick={() => setVistaActiva(tab.id)} style={{ background: vistaActiva === tab.id ? 'var(--gold)' : 'transparent', color: vistaActiva === tab.id ? '#080b14' : 'var(--muted)', border: 'none', borderRadius: '7px', padding: '5px 14px', fontSize: '0.8rem', fontWeight: vistaActiva === tab.id ? 700 : 400, cursor: 'pointer', transition: 'all 0.2s ease' }}>
                {tab.label}
              </button>
            ))}
          </div>
          <button onClick={() => navigate('/')} style={{ marginLeft: 'auto', background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: '8px', padding: '5px 14px', cursor: 'pointer', fontSize: '0.8rem', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)' }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}>
            Ver colección completa
          </button>
        </div>

        {libros.length === 0 && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '20px', padding: '3rem', textAlign: 'center' }}>
            <span style={{ fontSize: '3rem', opacity: 0.3 }}>📚</span>
            <p style={{ color: 'var(--muted)', marginTop: '1rem', marginBottom: '1rem' }}>Tu colección está vacía.</p>
            <button onClick={() => navigate('/buscar')} style={{ background: 'var(--gold)', border: 'none', color: '#080b14', borderRadius: '8px', padding: '8px 20px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}>
              Buscar libros
            </button>
          </div>
        )}

        {libros.length > 0 && vistaActiva === 'favoritos' && librosFavoritos.length === 0 && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '20px', padding: '2.5rem', textAlign: 'center' }}>
            <span style={{ fontSize: '2.5rem', opacity: 0.3 }}>☆</span>
            <p style={{ color: 'var(--text)', fontFamily: "'Playfair Display', serif", marginTop: '0.75rem', marginBottom: '0.4rem', fontWeight: 600 }}>Aún no tienes favoritos</p>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>Presiona ★ en cualquier libro de tu colección para agregarlo aquí.</p>
            <button onClick={() => setVistaActiva('todos')} style={{ background: 'transparent', border: '1px solid var(--gold)', color: 'var(--gold)', borderRadius: '8px', padding: '6px 18px', cursor: 'pointer', fontSize: '0.82rem' }}>
              Ver todos mis libros
            </button>
          </div>
        )}

        {librosVisibles.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1rem' }}>
            {librosVisibles.map((libro, i) => (
              <div key={libro.id} style={{ animation: 'fadeInUp 0.35s ease both', animationDelay: `${i * 0.04}s` }}>
                <LibroCard
                  libro={libro}
                  onToggleFav={handleToggleFav}
                  portadaError={portadasError[libro.id]}
                  onPortadaError={() => setPortadasError(prev => ({ ...prev, [libro.id]: true }))}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PerfilUsuario