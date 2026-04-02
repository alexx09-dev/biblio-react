// src/libros/BuscarLibros.jsx
// FASE 3B — Buscador de libros externos via Open Library
// El usuario busca, ve resultados y agrega directo a su biblioteca

import { useState } from 'react'
import { crearLibro } from '../api/libros'
import Toast from '../componentes/Toast'

function BuscarLibros() {
  const [query, setQuery]         = useState('')
  const [resultados, setResultados] = useState([])
  const [buscando, setBuscando]   = useState(false)
  const [agregados, setAgregados] = useState({})
  const [toast, setToast]         = useState({ visible: false, mensaje: '', tipo: 'success' })

  const buscar = async () => {
    if (!query.trim()) return
    setBuscando(true)
    setResultados([])
    try {
      const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=12&fields=key,title,author_name,first_publish_year,isbn,subject,first_sentence`)
      const data = await res.json()
      setResultados(data.docs || [])
    } catch (err) {
      setToast({ visible: true, mensaje: 'Error al buscar libros.', tipo: 'danger' })
    } finally {
      setBuscando(false)
    }
  }

  const handleAgregar = async (libro) => {
    const isbn = libro.isbn?.[0] || null
    const key  = libro.key

    try {
      // Obtener sinopsis desde Open Library
      let sinopsis = null
      if (isbn) {
        try {
          const res  = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`)
          const data = await res.json()
          const info = data[`ISBN:${isbn}`]
          sinopsis   = info?.excerpts?.[0]?.text || info?.description || null
          if (typeof sinopsis === 'object') sinopsis = sinopsis?.value || null
        } catch {}
      }

      await crearLibro({
        titulo:   libro.title,
        autor:    libro.author_name?.[0] || 'Autor desconocido',
        rating:   1,
        isbn:     isbn,
        genero:   libro.subject?.[0] || null,
        anio:     libro.first_publish_year || null,
        sinopsis: sinopsis,
      })

      setAgregados(prev => ({ ...prev, [key]: true }))
      setToast({ visible: true, mensaje: `"${libro.title}" agregado a tu biblioteca!`, tipo: 'success' })
    } catch (err) {
      setToast({ visible: true, mensaje: 'Error al agregar el libro.', tipo: 'danger' })
    }
  }

  return (
    <div className="container py-4" style={{ maxWidth: '1100px' }}>

      {/* Encabezado */}
      <div className="mb-4">
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--gold)', fontSize: '2.2rem', fontWeight: 900 }}>
          🔍 Buscar Libros
        </h2>
        <p style={{ color: 'var(--muted)' }}>
          Buscá cualquier libro y agrégalo directamente a tu biblioteca.
        </p>
      </div>

      {/* Buscador */}
      <div className="d-flex gap-2 mb-4">
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '10px 16px',
          gap: '10px',
        }}>
          <span style={{ fontSize: '1.1rem' }}>🔍</span>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && buscar()}
            placeholder="Buscar por título, autor o ISBN..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text)',
              fontSize: '1rem',
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
          {query && (
            <button onClick={() => { setQuery(''); setResultados([]) }}
              style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
          )}
        </div>
        <button
          onClick={buscar}
          disabled={buscando}
          style={{
            background: 'var(--gold)',
            color: '#080b14',
            border: 'none',
            borderRadius: '12px',
            padding: '10px 24px',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: buscando ? 'not-allowed' : 'pointer',
            opacity: buscando ? 0.7 : 1,
            whiteSpace: 'nowrap',
          }}
        >
          {buscando ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {/* Skeleton */}
      {buscando && (
        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="col">
              <div style={{ background: 'var(--surface)', borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ aspectRatio: '2/3', background: 'linear-gradient(90deg, var(--surface) 25%, var(--surface2) 50%, var(--surface) 75%)', backgroundSize: '800px 100%', animation: 'shimmer 1.4s infinite linear' }} />
                <div className="p-3">
                  <div style={{ height: '16px', borderRadius: '6px', marginBottom: '8px', background: 'var(--surface2)' }} />
                  <div style={{ height: '12px', width: '60%', borderRadius: '6px', background: 'var(--surface2)' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resultados */}
      {!buscando && resultados.length > 0 && (
        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4">
          {resultados.map((libro, i) => {
            const isbn     = libro.isbn?.[0]
            const agregado = agregados[libro.key]
            return (
              <div key={libro.key} className="col" style={{ animation: `fadeInUp 0.4s ease ${i * 0.05}s both` }}>
                <div style={{
                  background: 'var(--surface)',
                  border: `1px solid ${agregado ? 'rgba(244,196,48,0.4)' : 'var(--border)'}`,
                  borderRadius: '16px',
                  overflow: 'hidden',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.4)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  {/* Portada */}
                  <div style={{ aspectRatio: '2/3', background: 'var(--surface2)', overflow: 'hidden' }}>
                    {isbn ? (
                      <img
                        src={`https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`}
                        alt={libro.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        onError={e => { e.target.style.display = 'none' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', opacity: 0.3 }}>📖</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3 d-flex flex-column" style={{ gap: '0.4rem', flex: 1 }}>
                    <h6 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text)', fontWeight: 700, marginBottom: 0, lineHeight: 1.3, fontSize: '0.9rem' }}>
                      {libro.title}
                    </h6>
                    <p style={{ color: 'var(--muted)', fontSize: '0.78rem', marginBottom: 0 }}>
                      {libro.author_name?.[0] || 'Autor desconocido'}
                    </p>
                    {libro.first_publish_year && (
                      <p style={{ color: 'var(--muted)', fontSize: '0.72rem', marginBottom: 0 }}>{libro.first_publish_year}</p>
                    )}

                    <button
                      onClick={() => !agregado && handleAgregar(libro)}
                      disabled={agregado}
                      style={{
                        marginTop: 'auto',
                        paddingTop: '0.5rem',
                        background: agregado ? 'rgba(244,196,48,0.1)' : 'var(--gold)',
                        color: agregado ? 'var(--gold)' : '#080b14',
                        border: agregado ? '1px solid rgba(244,196,48,0.3)' : 'none',
                        borderRadius: '8px',
                        padding: '8px',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        cursor: agregado ? 'default' : 'pointer',
                        transition: 'all 0.2s ease',
                        width: '100%',
                      }}
                    >
                      {agregado ? '✓ Agregado' : '+ Agregar'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Sin resultados */}
      {!buscando && resultados.length === 0 && query && (
        <div className="text-center py-5">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
          <h5 style={{ color: 'var(--text)', fontFamily: "'Playfair Display', serif" }}>Sin resultados</h5>
          <p style={{ color: 'var(--muted)' }}>Intentá con otro título o autor.</p>
        </div>
      )}

      <Toast visible={toast.visible} mensaje={toast.mensaje} tipo={toast.tipo} onClose={() => setToast(prev => ({ ...prev, visible: false }))} />
    </div>
  )
}

export default BuscarLibros