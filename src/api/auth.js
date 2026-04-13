// src/api/auth.js
import axios from 'axios'

const authApi = axios.create({
  baseURL: 'https://biblio-backend-ktep.onrender.com/api/auth',
})

authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const registrarUsuario = async (datos) => {
  const response = await authApi.post('/register', datos)
  localStorage.setItem('token', response.data.access_token)
  localStorage.setItem('usuario', JSON.stringify(response.data.usuario))
  return response.data
}

export const loginUsuario = async (datos) => {
  const response = await authApi.post('/login', datos)
  localStorage.setItem('token', response.data.access_token)
  localStorage.setItem('usuario', JSON.stringify(response.data.usuario))
  return response.data
}

export const logoutUsuario = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
}

export const obtenerUsuarioLocal = () => {
  const usuario = localStorage.getItem('usuario')
  return usuario ? JSON.parse(usuario) : null
}

export const estaLogueado = () => !!localStorage.getItem('token')

export const obtenerPerfil = async () => {
  const response = await authApi.get('/me')
  localStorage.setItem('usuario', JSON.stringify(response.data))
  return response.data
}

export const actualizarPerfil = async (datos) => {
  const response = await authApi.put('/me', datos)
  localStorage.setItem('usuario', JSON.stringify(response.data))
  return response.data
}

// [FASE 6A] Estadísticas reales de la colección
export const obtenerStats = async () => {
  const response = await authApi.get('/me/stats')
  return response.data
}

export default authApi