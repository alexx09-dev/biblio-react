import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexto/AuthContext'

function RutaProtegida({ children }) {
  const { logueado } = useAuth()
  if (!logueado) return <Navigate to="/login" replace />
  return children
}

export default RutaProtegida