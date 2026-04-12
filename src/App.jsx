import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider }       from './contexto/AuthContext'
import Navegacion             from './componentes/Navegacion'
import RutaProtegida          from './componentes/RutaProtegida'
import ListadoLibros          from './libros/ListadoLibros'
import AgregarLibro           from './libros/AgregarLibro'
import DetalleLibro           from './libros/DetalleLibro'
import AuthPage               from './libros/AuthPage'
import Onboarding             from './libros/Onboarding'
import BuscarLibros           from './libros/BuscarLibros'
import PerfilUsuario          from './libros/PerfilUsuario'
import PaginaNoEncontrada     from './componentes/PaginaNoEncontrada'

function App() {
  const [busqueda, setBusqueda] = useState('')

  return (
    <AuthProvider>
      <BrowserRouter>
        <Navegacion onBuscar={setBusqueda} />
        <Routes>
          <Route path="/login"    element={<AuthPage />} />
          <Route path="/registro" element={<AuthPage />} />

          <Route path="/" element={<RutaProtegida><ListadoLibros busqueda={busqueda} /></RutaProtegida>} />
          <Route path="/agregar" element={<RutaProtegida><AgregarLibro /></RutaProtegida>} />
          <Route path="/libros/:id" element={<RutaProtegida><DetalleLibro /></RutaProtegida>} />
          <Route path="/buscar" element={<RutaProtegida><BuscarLibros /></RutaProtegida>} />
          <Route path="/onboarding" element={<RutaProtegida><Onboarding /></RutaProtegida>} />
          <Route path="/perfil" element={<RutaProtegida><PerfilUsuario /></RutaProtegida>} />

          <Route path="*" element={<PaginaNoEncontrada />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App