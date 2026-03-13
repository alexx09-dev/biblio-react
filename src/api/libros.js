import axios from 'axios'

export const urlBase = 'https://biblio-backend-ktep.onrender.com/api/libros'
const api = axios.create({
  baseURL: urlBase,
})

// [EXISTENTE]
export const listarLibros = async (genero = null, busqueda = null) => {
  const params = {}
  if (genero)   params.genero   = genero
  if (busqueda) params.busqueda = busqueda

  const response = await api.get('/', { params })
  return response.data
}

// [EXISTENTE]
export const crearLibro = async (datos) => {
  if (!datos.titulo || !datos.titulo.trim()) {
    throw new Error('El título es obligatorio.')
  }
  if (!datos.autor || !datos.autor.trim()) {
    throw new Error('El autor es obligatorio.')
  }
  if (!datos.rating || datos.rating < 1 || datos.rating > 5) {
    throw new Error('La calificación debe ser entre 1 y 5 estrellas.')
  }
  if (datos.anio) {
    const anioNum = Number(datos.anio)
    if (isNaN(anioNum) || anioNum < 1000 || anioNum > 2099) {
      throw new Error('El año debe ser un número válido entre 1000 y 2099.')
    }
  }
  const payload = {
    titulo:  datos.titulo.trim(),
    autor:   datos.autor.trim(),
    rating:  Number(datos.rating),
    isbn:    datos.isbn?.trim()   || null,
    genero:  datos.genero?.trim() || null,
    anio:    datos.anio           ? Number(datos.anio) : null,
  }
  const response = await api.post('/', payload)
  return response.data
}

// [EXISTENTE]
export const obtenerLibroPorId = async (id) => {
  const response = await api.get(`/${id}`)
  return response.data
}

// [EXISTENTE]
export const actualizarLibro = async (id, datos) => {
  if (!datos.titulo || !datos.titulo.trim()) {
    throw new Error('El título es obligatorio.')
  }
  if (!datos.autor || !datos.autor.trim()) {
    throw new Error('El autor es obligatorio.')
  }
  if (!datos.rating || datos.rating < 1 || datos.rating > 5) {
    throw new Error('La calificación debe ser entre 1 y 5 estrellas.')
  }
  if (datos.anio) {
    const anioNum = Number(datos.anio)
    if (isNaN(anioNum) || anioNum < 1000 || anioNum > 2099) {
      throw new Error('El año debe ser un número válido entre 1000 y 2099.')
    }
  }
  const payload = {
    titulo:  datos.titulo.trim(),
    autor:   datos.autor.trim(),
    rating:  Number(datos.rating),
    isbn:    datos.isbn?.trim()   || null,
    genero:  datos.genero?.trim() || null,
    anio:    datos.anio           ? Number(datos.anio) : null,
  }
  const response = await api.put(`/${id}`, payload)
  return response.data
}

// [NUEVO]
// Elimina un libro por su ID via DELETE.
// No requiere body en la petición, solo el ID en la URL.
export const eliminarLibro = async (id) => {
  const response = await api.delete(`/${id}`)
  return response.data
}

export default api