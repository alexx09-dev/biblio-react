// src/componentes/RutaProtegida.jsx
// Es como un guardia en la puerta de una discoteca
// Si tenés entrada (token) pasás, si no tenés te manda a la puerta de login

import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexto/AuthContext'

function RutaProtegida({ children }) {
  const { logueado } = useAuth()

  // Si no está logueado, lo redirige automáticamente al login
  // replace={true} significa que no puede volver atrás con el botón del navegador
  if (!logueado) {
    return <Navigate to="/login" replace />
  }

  // Si está logueado, muestra el contenido normal
  return children
}

export default RutaProtegida