// src/App.jsx
// El cerebro de la navegación — define qué página se muestra en cada URL
// Ahora también envuelve todo con el AuthProvider para que cualquier
// componente pueda saber si hay un usuario logueado

import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexto/AuthContext'
import Navegacion         from './componentes/Navegacion'
import RutaProtegida      from './componentes/RutaProtegida'
import ListadoLibros      from './libros/ListadoLibros'
import AgregarLibro       from './libros/AgregarLibro'
import DetalleLibro       from './libros/DetalleLibro'
import EditarLibro        from './libros/EditarLibro'
import AuthPage from './libros/AuthPage'
import PaginaNoEncontrada from './componentes/PaginaNoEncontrada'

function App() {
  const [busqueda, setBusqueda] = useState('')

  return (
    // AuthProvider envuelve TODO — es la mochila global disponible en toda la app
    <AuthProvider>
      <BrowserRouter>
        <Navegacion onBuscar={setBusqueda} />
        <Routes>

          {/* Rutas PÚBLICAS — cualquiera puede verlas sin estar logueado */}
          <Route path="/login"    element={<AuthPage />} />
          <Route path="/registro" element={<AuthPage />} />

          {/* Rutas PROTEGIDAS — solo usuarios logueados pueden verlas */}
          {/* RutaProtegida actúa como el guardia — si no estás logueado, te manda al login */}
          <Route path="/" element={
            <RutaProtegida>
              <ListadoLibros busqueda={busqueda} />
            </RutaProtegida>
          } />
          <Route path="/agregar" element={
            <RutaProtegida>
              <AgregarLibro />
            </RutaProtegida>
          } />
          <Route path="/libros/:id" element={
            <RutaProtegida>
              <DetalleLibro />
            </RutaProtegida>
          } />
          <Route path="/editar/:id" element={
            <RutaProtegida>
              <EditarLibro />
            </RutaProtegida>
          } />

          {/* Cualquier URL que no existe → página 404 */}
          <Route path="*" element={<PaginaNoEncontrada />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App