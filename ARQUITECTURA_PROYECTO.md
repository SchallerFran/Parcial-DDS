# 🏗️ ARQUITECTURA DEL PROYECTO

## Diagrama General

```
┌─────────────────────────────────────────────────────────────────────┐
│                    AGENDA DE ENTREVISTAS - DDS 2026                 │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────┐          ┌──────────────────────────┐
│      FRONTEND (React)       │          │   BACKEND (Express)      │
└─────────────────────────────┘          └──────────────────────────┘

Frontend:                           Backend:
├── src/                             ├── src/
│   ├── components/                  │   ├── routes/
│   │   ├── ProtectedRoute.jsx✅      │   │   ├── auth.routes.js
│   │   └── Navbar.jsx✅             │   │   └── entrevistas.routes.js
│   ├── config/                      │   ├── controllers/
│   │   └── axio.jsx✅               │   │   ├── authController.js
│   ├── context/                     │   │   └── entrevistasController.js
│   │   └── AuthContext.jsx✅        │   ├── services/
│   ├── hooks/                       │   │   ├── authService.js
│   │   └── useAsync.js✅            │   │   └── entrevistasService.js
│   ├── pages/                       │   ├── middlewares/
│   │   ├── LoginPage.jsx✅          │   │   ├── authMiddleware.js
│   │   ├── RegisterPage.jsx✅       │   │   └── errorHandler.js
│   │   ├── EntrevistasPage.jsx✅    │   └── app.js
│   │   ├── EntrevistaDetalle.jsx✅  │
│   │   ├── EntrevistaForm.jsx✅     │
│   │   ├── ResumenPage.jsx✅        │
│   │   └── NotFound.jsx✅           │
│   ├── routes/                      │
│   │   └── AppRouter.jsx✅          │
│   ├── services/                    │
│   │   ├── auth.service.jsx✅       │
│   │   ├── entrevistas.service.jsx✅
│   │   └── postulantes.service.jsx✅
│   ├── App.jsx✅                    │
│   └── main.jsx✅                   │
└────────────────────────────────────┴──────────────────────────────
```

---

## 🔄 Flujo de Autenticación

```
┌──────────────┐
│  LoginPage   │
└──────┬───────┘
       │ email, password
       ▼
┌──────────────────────┐
│ auth.service.login() │ ◄─── Espera Backend
└──────┬───────────────┘
       │ token + usuario
       ▼
┌──────────────────┐
│  localStorage    │
│  - token         │
│  - usuario       │
└──────┬───────────┘
       │
       ▼
┌──────────────────────┐
│  AuthContext         │
│  - setUsuario()      │
│  - token guardado    │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  useAuth() hook      │
│  Disponible en       │
│  todos los componentes
└──────────────────────┘
```

---

## 📡 Llamadas API

```
Frontend (Servicios)        →  Axios Interceptor  →  Backend (Express)
                                │
                                ├─ Agrega header:
                                │  Authorization: Bearer {token}
                                │
                                └─ Timeout: 10s

Rutas:
POST   /api/auth/register       ←→  authService.register()
POST   /api/auth/login          ←→  authService.login()
GET    /api/entrevistas         ←→  entrevistasService.listar()
GET    /api/entrevistas/:id     ←→  entrevistasService.obtener()
POST   /api/entrevistas         ←→  entrevistasService.crear()
PUT    /api/entrevistas/:id     ←→  entrevistasService.editar()
...y más (ver ANALISIS_COMPLETO_ESTADO_PROYECTO.md)
```

---

## 🛣️ Rutas Frontend (React Router)

```
/
├── PUBLIC
│   ├── /login              [LoginPage]
│   └── /registro           [RegisterPage]
│
├── PROTECTED (requiere autenticación)
│   ├── /entrevistas        [EntrevistasPage]
│   ├── /entrevistas/:id    [EntrevistaDetalle]
│   ├── /entrevistas/crear  [EntrevistaForm]
│   ├── /entrevistas/:id/editar [EntrevistaForm]
│   │
│   └── ADMIN/RRHH ONLY
│       └── /resumen        [ResumenPage]
│
└── 404
    └── /*                  [NotFound]
```

---

## 🔐 Protecciones de Rol

```
┌─────────────────────────────────────────┐
│       Usuario (desde AuthContext)       │
├─────────────────────────────────────────┤
│ estaAutenticado: boolean                │
│ esAdmin: usuario?.rol === "admin"       │
│ esRRHH: usuario?.rol === "rrhh"         │
│ esEntrevistador: usuario?.rol === "...  │
│ puedeGestionar: esAdmin || esRRHH       │
└─────────────────────────────────────────┘
          │
          ├─ Solo admin/rrhh pueden:
          │  - Crear entrevistas
          │  - Editar entrevistas
          │  - Ver panel de resumen
          │
          └─ Todos pueden:
             - Ver entrevistas asignadas/listadas
             - Ver detalle
             - Logout
```

---

## 📊 Estado Global (Context)

```
AuthContext {
  usuario: {
    id,
    nombre,
    email,
    rol: "admin" | "rrhh" | "entrevistador"
  },
  token: string,
  cargando: boolean,
  error: string | null,
  
  // Métodos
  login(email, password) → Promise
  register(nombre, email, password, rol) → Promise
  logout() → void
  
  // Derived State
  estaAutenticado: boolean
  esAdmin: boolean
  esRRHH: boolean
  esEntrevistador: boolean
  puedeGestionar: boolean
}
```

---

## 🎯 Estados de Entrevista

```
                    ┌──────────────┐
                    │  PROGRAMADA  │ ◄─── Inicial
                    └──┬───────┬───┘
                       │       │
         ┌─────────────┘       └──────────────┐
         │                                     │
         ▼                                     ▼
    ┌─────────────┐                    ┌──────────────┐
    │  REALIZADA  │                    │  CANCELADA   │
    └─────────────┘                    └──────────────┘
         ▲
         │
    ┌────┴──────────┐
    │ REPROGRAMADA  │ ◄─── Cambio de fecha/hora/entrevistador
    └───────────────┘
```

---

## 📦 Servicios HTTP

```
┌──────────────────────────────────────────┐
│        Services (Frontend)               │
├──────────────────────────────────────────┤
│                                          │
│  auth.service.js                         │
│  ├── login()                             │
│  ├── register()                          │
│  ├── logout()                            │
│  ├── getToken()                          │
│  └── estaAutenticado()                   │
│                                          │
│  entrevistas.service.js                  │
│  ├── listar(filtros)                     │
│  ├── obtener(id)                         │
│  ├── crear(data)                         │
│  ├── editar(id, data)                    │
│  ├── cancelar(id, obs)                   │
│  ├── marcarRealizada(id, obs)            │
│  ├── reprogramar(id, data)               │
│  ├── obtenerHistorial(id)                │
│  └── obtenerResumen()                    │
│                                          │
│  postulantes.service.js                  │
│  ├── listar()                            │
│  ├── obtener(id)                         │
│  ├── crear(data)                         │
│  ├── editar(id, data)                    │
│  └── cambiarEstado(id, estado)           │
│                                          │
└──────────────────────────────────────────┘
```

---

## 🔗 Integración de Componentes

```
App.jsx
├── Navbar (si estaAutenticado)
│   ├── Links: /entrevistas, /resumen
│   └── Logout button
│
└── AppRouter
    └── BrowserRouter
        └── Routes
            ├── Route /login → LoginPage
            ├── Route /registro → RegisterPage
            ├── Route /entrevistas → ProtectedRoute → EntrevistasPage
            ├── Route /entrevistas/:id → ProtectedRoute → EntrevistaDetalle
            ├── Route /entrevistas/crear → ProtectedRoute → EntrevistaForm
            ├── Route /entrevistas/:id/editar → ProtectedRoute → EntrevistaForm
            ├── Route /resumen → ProtectedRoute → ResumenPage
            └── Route * → NotFound

ProtectedRoute
├── Verifica: ¿Hay usuario?
│   └── No → Redirect /login
│
├── Verifica: ¿Tiene rol requerido?
│   └── No → Redirect /no-autorizado
│
└── Sí → Renderiza componente hijo
```

---

## 📝 Validaciones

```
Cliente (React):
├── Validación de campos requeridos
├── Validación de formato email
├── Validación de horarios (inicio < fin)
├── Validación de modalidad
│   ├── Presencial → Debe tener ubicación
│   └── Virtual → Debe tener link
├── Estados de carga
└── Mensajes de error

Servidor (Backend - TODO):
├── Validación de estructura JSON
├── Validación de usuario autenticado
├── Validación de permisos
├── Validación de negocio:
│   ├── ¿Postulante existe?
│   ├── ¿Postulante estado válido?
│   ├── ¿Entrevistador disponible?
│   ├── ¿Sin conflictos de horario?
│   └── ¿Modalidad coherente?
└── Persistencia en DB
```

---

## 🚀 Ciclo de Vida de una Solicitud

```
1. Usuario lleña formulario
   │
   └─► Validación cliente
       │
       └─► Si error: Mostrar mensajes
       │
       └─► Si OK: Enviar a servicio
           │
           └─► entrevistasService.crear(data)
               │
               └─► axios.post("/api/entrevistas", data)
                   │
                   ├─ Interceptor agrega: Authorization: Bearer {token}
                   │
                   └─► Enviado a backend
                       │
                       └─► Backend valida
                           │
                           ├─ Si error: Responde 400/401/403/500
                           │
                           └─ Si OK: Guarda y responde 201
                               │
                               └─► Frontend: ¿Error?
                                   │
                                   ├─ Sí: Mostrar mensaje
                                   │
                                   └─ No: Redirigir a /entrevistas
```

---

## ⚙️ Configuración Importante

```
BaseURL: http://localhost:3000/api
Timeout: 10000ms (10s)
Headers: Content-Type: application/json

JWT Interceptor:
├─ Request: Agrega Bearer token
├─ Response: Maneja 401/403 automáticamente (TODO en backend)
└─ Error: Loguea en consola

LocalStorage:
├─ token: Se guarda al login
├─ usuario: Se guarda al login
└─ Se limpia al logout
```

---

**Elaborado:** 9 de junio 2026  
**Estado:** Frontend ✅ | Backend ❌  
**Siguiente:** Implementar Backend
