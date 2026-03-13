const FallbackThumb = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(160deg, var(--surface2) 0%, var(--bg) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
    }}
  >
    📖
  </div>
)

function HeroColeccion({ genero, libros }) {
  const thumbnails = libros.slice(0, 5)

  const descripciones = {
    'Terror':          'Historias que te mantendrán despierto por las noches.',
    'Ciencia Ficción': 'Universos que desafían los límites de la imaginación.',
    'Historia':        'Los eventos que moldearon el mundo que conocemos.',
    'Romance':         'Historias de amor que perduran en el tiempo.',
    'Juvenil':         'Aventuras que despiertan la imaginación a cualquier edad.',
    'Misterio':        'Enigmas que no podrás dejar de resolver.',
    'Bélico':          'Relatos del coraje y sacrificio en tiempos de guerra.',
    'Biografía':       'Vidas extraordinarias que inspiran la nuestra.',
    'Filosofía':       'Reflexiones que cuestionan todo lo que creemos saber.',
    'Otro':            'Una selección única que desafía cualquier categoría.',
  }

  const descripcion = descripciones[genero] || `Explora la colección de ${genero}.`

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, var(--surface) 0%, var(--surface2) 60%, var(--bg) 100%)',
        border: '1px solid var(--border)',
        borderRadius: '24px',
        padding: '2.5rem',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Gradiente decorativo de fondo */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 70% 50%, rgba(244,196,48,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="row align-items-center g-4" style={{ position: 'relative', zIndex: 1 }}>

        {/* Columna de texto */}
        <div className="col-12 col-md-5">
          <p
            style={{
              color: 'var(--gold)',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}
          >
            · Colección Destacada ·
          </p>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              color: 'var(--text)',
              fontSize: '2.4rem',
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: '0.75rem',
            }}
          >
            {genero}
          </h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            {descripcion}
          </p>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(244,196,48,0.1)',
              border: '1px solid rgba(244,196,48,0.2)',
              borderRadius: '20px',
              padding: '5px 14px',
              color: 'var(--gold)',
              fontSize: '0.82rem',
              fontWeight: 600,
            }}
          >
            <i className="bi bi-collection-fill"></i>
            {libros.length} {libros.length === 1 ? 'libro' : 'libros'}
          </div>
        </div>

        {/* Columna de thumbnails */}
        <div className="col-12 col-md-7">
          <div
            className="d-flex gap-3 justify-content-center justify-content-md-end"
            style={{ alignItems: 'flex-end' }}
          >
            {thumbnails.map((libro, index) => {
              // El thumbnail del centro es más alto
              const esCentral = index === Math.floor(thumbnails.length / 2)
              const altura = esCentral ? '160px' : '120px'

              return (
                <div
                  key={libro.id}
                  style={{
                    width: '80px',
                    height: altura,
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid var(--border)',
                    flexShrink: 0,
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                    boxShadow: esCentral
                      ? '0 8px 24px rgba(0,0,0,0.5)'
                      : '0 4px 12px rgba(0,0,0,0.3)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-6px)'
                    e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.6)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'none'
                    e.currentTarget.style.boxShadow = esCentral
                      ? '0 8px 24px rgba(0,0,0,0.5)'
                      : '0 4px 12px rgba(0,0,0,0.3)'
                  }}
                >
                  {libro.isbn ? (
                    <img
                      src={`https://covers.openlibrary.org/b/isbn/${libro.isbn}-L.jpg`}
                      alt={libro.titulo}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onError={e => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.nextSibling.style.display = 'flex'
                      }}
                    />
                  ) : null}
                  <div style={{ display: libro.isbn ? 'none' : 'flex', width: '100%', height: '100%' }}>
                    <FallbackThumb />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}

export default HeroColeccion