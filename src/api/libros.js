// api/libros.js
// Este archivo maneja TODAS las llamadas al backend relacionadas con libros

import axios from 'axios'

export const urlBase = 'https://biblio-backend-ktep.onrender.com/api/libros'

const api = axios.create({ baseURL: urlBase })

// ---------------------------------------------------------------------------
// Interceptor — igual que en auth.js
// Antes de CADA petición a /api/libros, agrega el token automáticamente
// Sin esto, el backend devuelve 401 en todos los endpoints de libros
// ---------------------------------------------------------------------------
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ---------------------------------------------------------------------------
// LISTAR — Devuelve los libros del usuario autenticado
// ---------------------------------------------------------------------------
export const listarLibros = async (genero = null, busqueda = null) => {
  const params = {}
  if (genero)   params.genero   = genero
  if (busqueda) params.busqueda = busqueda
  const response = await api.get('/', { params })
  return response.data
}

// ---------------------------------------------------------------------------
// CREAR — Crea un libro asociado al usuario autenticado
// ---------------------------------------------------------------------------
export const crearLibro = async (datos) => {
  if (!datos.titulo || !datos.titulo.trim()) throw new Error('El título es obligatorio.')
  if (!datos.autor  || !datos.autor.trim())  throw new Error('El autor es obligatorio.')
  if (!datos.rating || datos.rating < 1 || datos.rating > 5) throw new Error('La calificación debe ser entre 1 y 5 estrellas.')
  if (datos.anio) {
    const anioNum = Number(datos.anio)
    if (isNaN(anioNum) || anioNum < 1000 || anioNum > 2099) throw new Error('El año debe ser un número válido entre 1000 y 2099.')
  }
  const payload = {
    titulo:   datos.titulo.trim(),
    autor:    datos.autor.trim(),
    rating:   Number(datos.rating),
    isbn:     datos.isbn?.trim()     || null,
    genero:   datos.genero?.trim()   || null,
    anio:     datos.anio             ? Number(datos.anio) : null,
    sinopsis: datos.sinopsis?.trim() || null,
  }
  const response = await api.post('/', payload)
  return response.data
}

// ---------------------------------------------------------------------------
// OBTENER POR ID — Devuelve un libro del usuario autenticado con sinopsis
// ---------------------------------------------------------------------------
export const obtenerLibroPorId = async (id) => {
  const response = await api.get(`/${id}`)
  return response.data
}

// ---------------------------------------------------------------------------
// ACTUALIZAR — Modifica un libro del usuario autenticado
// ---------------------------------------------------------------------------
export const actualizarLibro = async (id, datos) => {
  if (!datos.titulo || !datos.titulo.trim()) throw new Error('El título es obligatorio.')
  if (!datos.autor  || !datos.autor.trim())  throw new Error('El autor es obligatorio.')
  if (!datos.rating || datos.rating < 1 || datos.rating > 5) throw new Error('La calificación debe ser entre 1 y 5 estrellas.')
  if (datos.anio) {
    const anioNum = Number(datos.anio)
    if (isNaN(anioNum) || anioNum < 1000 || anioNum > 2099) throw new Error('El año debe ser un número válido entre 1000 y 2099.')
  }
  const payload = {
    titulo:   datos.titulo.trim(),
    autor:    datos.autor.trim(),
    rating:   Number(datos.rating),
    isbn:     datos.isbn?.trim()     || null,
    genero:   datos.genero?.trim()   || null,
    anio:     datos.anio             ? Number(datos.anio) : null,
    sinopsis: datos.sinopsis?.trim() || null,
  }
  const response = await api.put(`/${id}`, payload)
  return response.data
}

// ---------------------------------------------------------------------------
// ELIMINAR — Elimina un libro del usuario autenticado
// ---------------------------------------------------------------------------
export const eliminarLibro = async (id) => {
  const response = await api.delete(`/${id}`)
  return response.data
}

export default api