import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navegacion          from './componentes/Navegacion'
import ListadoLibros       from './libros/ListadoLibros'
import AgregarLibro        from './libros/AgregarLibro'
import DetalleLibro        from './libros/DetalleLibro'
import EditarLibro         from './libros/EditarLibro'
import PaginaNoEncontrada  from './componentes/PaginaNoEncontrada'  // [NUEVO]

function App() {
  const [busqueda, setBusqueda] = useState('')

  return (
    <BrowserRouter>
      <Navegacion onBuscar={setBusqueda} />
      <Routes>
        <Route path="/"           element={<ListadoLibros busqueda={busqueda} />} />
        <Route path="/agregar"    element={<AgregarLibro />} />
        <Route path="/libros/:id" element={<DetalleLibro />} />
        <Route path="/editar/:id" element={<EditarLibro />} />
        <Route path="*"           element={<PaginaNoEncontrada />} />  {/* [NUEVO] */}
      </Routes>
    </BrowserRouter>
  )
}

export default App