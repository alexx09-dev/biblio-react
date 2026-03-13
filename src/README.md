# 📚 Biblioteca Personal — Frontend React

Aplicación web para gestionar tu colección de libros personal.
CRUD completo con identidad visual propia, portadas reales,
animaciones CSS y componentes de nivel producción.

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=flat&logo=bootstrap)
![Axios](https://img.shields.io/badge/Axios-1.x-5A29E4?style=flat&logo=axios)
![React Router](https://img.shields.io/badge/React_Router-6-CA4245?style=flat&logo=reactrouter)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?style=flat&logo=javascript)

---

## ✨ Características

- 📖 Grid de cards con portadas reales via **Open Library API**
- 🔍 Búsqueda en tiempo real desde el navbar
- 🏷 Filtrado dinámico por género y autor con chips interactivos
- 🎬 Hero Section por colección destacada
- 📑 Vista de detalle con Split Layout de solo lectura
- ⭐ Selector de estrellas interactivo (sin librerías externas)
- 🖼 Previsualización en vivo de portada al escribir el ISBN
- 💀 Skeleton loaders en cards y formularios
- 🔔 Toast notifications con auto-cierre (éxito, error, advertencia)
- 🗑 Modal de confirmación antes de eliminar
- 🎨 Animaciones CSS propias (fadeInUp, slideInUp, scaleIn, shimmer)
- 🚫 Página 404 personalizada y temática
- 🌙 Dark mode completo con paleta dorada propia

---

## ⚙️ Tecnologías

| Tecnología       | Versión  | Uso                                      |
|------------------|----------|------------------------------------------|
| React            | 18       | Framework de UI                          |
| Vite             | 5        | Bundler y servidor de desarrollo         |
| Axios            | 1.x      | Cliente HTTP para consumir el backend    |
| Bootstrap        | 5.3      | Componentes UI y grid responsivo         |
| Bootstrap Icons  | 1.11     | Iconografía                              |
| React Router DOM | 6        | Navegación entre vistas                  |
| Open Library API | —        | Portadas de libros gratis via ISBN       |
| Google Fonts     | —        | Playfair Display + DM Sans               |

---

## 📋 Requisitos previos

- Node.js 18 o superior
- Backend corriendo en `http://localhost:2603`
- Conexión a internet (Google Fonts y Open Library API)

---

## 🚀 Instalación
```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/biblio-react.git

# 2. Entrar a la carpeta
cd biblio-react

# 3. Instalar dependencias
npm install

# 4. Iniciar el servidor de desarrollo
npm run dev
```

Abrir en el navegador: [http://localhost:5173](http://localhost:5173)

---

## 🗺 Rutas de la aplicación

| Ruta           | Componente           | Descripción                        |
|----------------|----------------------|------------------------------------|
| `/`            | ListadoLibros        | Listado con filtros y Hero Section |
| `/agregar`     | AgregarLibro         | Formulario para nuevo libro        |
| `/editar/:id`  | EditarLibro          | Formulario de edición              |
| `/libros/:id`  | DetalleLibro         | Vista de detalle (solo lectura)    |
| `*`            | PaginaNoEncontrada   | Error 404 personalizado            |

---

## 🧱 Estructura del proyecto
```
biblio-react/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── api/
    │   └── libros.js
    ├── libros/
    │   ├── ListadoLibros.jsx
    │   ├── AgregarLibro.jsx
    │   ├── EditarLibro.jsx
    │   └── DetalleLibro.jsx
    └── componentes/
        ├── Navegacion.jsx
        ├── Toast.jsx
        ├── ModalConfirmacion.jsx
        ├── HeroColeccion.jsx
        └── PaginaNoEncontrada.jsx
```

---

## 🎨 Identidad visual

| Variable        | Color     | Uso                        |
|-----------------|-----------|----------------------------|
| `--bg`          | `#080b14` | Fondo general              |
| `--surface`     | `#0f1422` | Cards y navbar             |
| `--surface2`    | `#161c2d` | Modales y toolbars         |
| `--gold`        | `#f4c430` | Acento principal           |
| `--blue-acc`    | `#3b82f6` | Botones editar             |
| `--red-acc`     | `#ef4444` | Botones eliminar           |
| `--green-acc`   | `#22c55e` | Toasts de éxito            |

Tipografía: **Playfair Display** (títulos) + **DM Sans** (cuerpo)

---

## 📸 Screenshots

> *Próximamente — agregar capturas del listado, detalle y formularios*

---

## 🔗 Backend relacionado

> Enlace al repositorio del backend:
> [biblio-backend](https://github.com/tu-usuario/biblio-backend)

---

## 🗺 Próximos pasos

- [ ] Deployment del frontend en **Vercel**
- [ ] Deployment del backend en **Railway** o **Render**
- [ ] Base de datos MySQL en la nube con **Railway**
- [ ] Toggle modo claro / oscuro
- [ ] Paginación del listado
- [ ] Debounce en la búsqueda del navbar