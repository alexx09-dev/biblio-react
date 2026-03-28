// src/api/auth.js
// Este archivo maneja TODAS las llamadas al backend relacionadas con usuarios
// Es como el "mensajero" entre el frontend y los endpoints /api/auth/...

import axios from 'axios'

// ---------------------------------------------------------------------------
// Instancia de axios apuntando al backend de autenticación
// Imaginate que esta es una línea telefónica directa con el servidor de auth
// ---------------------------------------------------------------------------
const authApi = axios.create({
  baseURL: 'https://biblio-backend-ktep.onrender.com/api/auth',
})

// ---------------------------------------------------------------------------
// Interceptor — como un guardia de seguridad en la puerta
// Antes de CADA petición, revisa si hay un token guardado
// Si hay token, lo agrega automáticamente al header de la petición
// Sin esto, tendríamos que agregar el token manualmente en cada llamada
// ---------------------------------------------------------------------------
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  // Si existe el token, lo agrega al header Authorization
  // Es como mostrar tu credencial antes de entrar a un edificio
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ---------------------------------------------------------------------------
// REGISTER — Crear una cuenta nueva
// Recibe: nombre, email, password, fecha_nacimiento (opcional)
// Devuelve: token JWT + datos del usuario
// ---------------------------------------------------------------------------
export const registrarUsuario = async (datos) => {
  const response = await authApi.post('/register', datos)
  // Guardamos el token en localStorage para usarlo en futuras peticiones
  // localStorage es como una memoria que no se borra al cerrar el navegador
  localStorage.setItem('token', response.data.access_token)
  localStorage.setItem('usuario', JSON.stringify(response.data.usuario))
  return response.data
}

// ---------------------------------------------------------------------------
// LOGIN — Iniciar sesión
// Recibe: email, password
// Devuelve: token JWT + datos del usuario
// ---------------------------------------------------------------------------
export const loginUsuario = async (datos) => {
  const response = await authApi.post('/login', datos)
  // Igual que en register, guardamos el token y los datos del usuario
  localStorage.setItem('token', response.data.access_token)
  localStorage.setItem('usuario', JSON.stringify(response.data.usuario))
  return response.data
}

// ---------------------------------------------------------------------------
// LOGOUT — Cerrar sesión
// No llama al backend — simplemente borra el token del localStorage
// Sin token, el usuario no puede hacer peticiones protegidas
// ---------------------------------------------------------------------------
export const logoutUsuario = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
}

// ---------------------------------------------------------------------------
// OBTENER USUARIO ACTUAL — Lee los datos del usuario desde localStorage
// No llama al backend — usa lo que ya tenemos guardado localmente
// Es instantáneo porque no hay que esperar respuesta del servidor
// ---------------------------------------------------------------------------
export const obtenerUsuarioLocal = () => {
  const usuario = localStorage.getItem('usuario')
  // Si no hay nada guardado, devuelve null (no hay sesión activa)
  return usuario ? JSON.parse(usuario) : null
}

// ---------------------------------------------------------------------------
// VERIFICAR SI ESTÁ LOGUEADO — Devuelve true o false
// Simplemente verifica si existe un token guardado
// ---------------------------------------------------------------------------
export const estaLogueado = () => {
  return !!localStorage.getItem('token')
}

// ---------------------------------------------------------------------------
// OBTENER PERFIL — Llama al backend para traer datos actualizados del usuario
// Útil cuando queremos asegurarnos que los datos son los más recientes
// ---------------------------------------------------------------------------
export const obtenerPerfil = async () => {
  const response = await authApi.get('/me')
  // Actualizamos los datos locales con los del servidor
  localStorage.setItem('usuario', JSON.stringify(response.data))
  return response.data
}

// ---------------------------------------------------------------------------
// ACTUALIZAR PERFIL — Modifica los datos del usuario
// Recibe: nombre, bio, foto_perfil, avatar_config (todos opcionales)
// NO puede modificar fecha_nacimiento — el backend lo bloquea
// ---------------------------------------------------------------------------
export const actualizarPerfil = async (datos) => {
  const response = await authApi.put('/me', datos)
  // Actualizamos los datos locales con los nuevos datos
  localStorage.setItem('usuario', JSON.stringify(response.data))
  return response.data
}

export default authApi