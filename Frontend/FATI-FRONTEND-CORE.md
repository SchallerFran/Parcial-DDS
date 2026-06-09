# Frontend Core — Guía de implementación
**Responsable:** Fati  
**Rama:** `feature/frontend-fati` (o el nombre que elijas)  
**Proyecto:** Agenda de Entrevistas — TP Previo Parcial 2 DDS 2026

---

## Índice

1. [Resumen de responsabilidades](#1-resumen-de-responsabilidades)
2. [Estructura de archivos](#2-estructura-de-archivos)
3. [Orden de construcción](#3-orden-de-construcción)
4. [Archivos a implementar](#4-archivos-a-implementar)
   - [config/axios.js](#41-configaxiosjs)
   - [services/auth.service.js](#42-servicesauthservicejs)
   - [services/entrevistas.service.js](#43-servicesentrevistasservicejs)
   - [services/postulantes.service.js](#44-servicespostulanteservicejs)
   - [context/AuthContext.jsx](#45-contextauthcontextjsx)
   - [hooks/useAsync.js](#46-hooksuseasyncjs)
   - [components/ProtectedRoute.jsx](#47-componentsprotectedroutejsx)
   - [routes/AppRouter.jsx](#48-routesapprouterjsx)
   - [main.jsx](#49-mainjsx)
   - [pages/LoginPage.jsx](#410-pagesloginpagejsx)
   - [pages/RegisterPage.jsx](#411-pagesregisterpagejsx)
   - [pages/EntrevistasPage.jsx](#412-pagesentrevistaspagejsx)
   - [pages/EntrevistaDetalle.jsx](#413-pagesentrevistadetalllejsx)
   - [pages/EntrevistaForm.jsx](#414-pagesentrevistaformjsx)
   - [pages/NotFound.jsx](#415-pagesnotfoundjsx)
5. [Requisitos del enunciado checklist](#5-requisitos-del-enunciado-checklist)
6. [Integración con el resto del grupo](#6-integración-con-el-resto-del-grupo)
7. [Errores frecuentes a evitar](#7-errores-frecuentes-a-evitar)

---

## 1. Resumen de responsabilidades

Tu parte cubre la **infraestructura base del frontend**: todo lo que necesita existir para que la app funcione y para que Andrés pueda construir encima sin problemas.

| Área | Qué incluye |
|---|---|
| Configuración HTTP | Instancia Axios con JWT automático e interceptores |
| Servicios | Un archivo por recurso: auth, entrevistas, postulantes |
| Estado global | AuthContext con usuario, token y helpers de rol |
| Routing | AppRouter con todas las rutas + ruta comodín |
| Protección | ProtectedRoute por autenticación y por rol |
| Páginas core | Login, Registro, Listado, Detalle, Formulario |

**Lo que NO te toca (le corresponde a Andrés):**
- Filtros avanzados y búsqueda combinada
- Panel resumen (`/resumen`)
- Historial visible dentro del detalle
- Estados de carga/vacío/error elaborados
- Manejo de errores de API con feedback visual detallado

---

## 2. Estructura de archivos

```
Frontend/
└── src/
    ├── config/
    │   └── axios.js                ← instancia Axios base
    ├── services/
    │   ├── auth.service.js         ← login, register, logout
    │   ├── entrevistas.service.js  ← todos los endpoints de entrevistas
    │   └── postulantes.service.js  ← listar postulantes
    ├── context/
    │   └── AuthContext.jsx         ← usuario, token, rol global
    ├── hooks/
    │   └── useAsync.js             ← hook reutilizable para fetch
    ├── components/
    │   └── ProtectedRoute.jsx      ← protección de rutas
    ├── routes/
    │   └── AppRouter.jsx           ← todas las rutas de la app
    ├── pages/
    │   ├── LoginPage.jsx
    │   ├── RegisterPage.jsx
    │   ├── EntrevistasPage.jsx
    │   ├── EntrevistaDetalle.jsx
    │   ├── EntrevistaForm.jsx
    │   └── NotFound.jsx
    ├── main.jsx                    ← punto de entrada
    └── index.css                   ← estilos globales
```

---

## 3. Orden de construcción

Seguí este orden estrictamente — cada archivo depende del anterior:

```
1.  config/axios.js                 (no depende de nada)
2.  services/auth.service.js        (depende de axios.js)
3.  services/entrevistas.service.js (depende de axios.js)
4.  services/postulantes.service.js (depende de axios.js)
5.  context/AuthContext.jsx         (depende de auth.service.js)
6.  hooks/useAsync.js               (no depende de nada)
7.  components/ProtectedRoute.jsx   (depende de AuthContext)
8.  routes/AppRouter.jsx            (depende de ProtectedRoute + todas las pages)
9.  main.jsx                        (depende de AuthContext + AppRouter)
10. pages/LoginPage.jsx             (depende de AuthContext)
11. pages/RegisterPage.jsx          (depende de AuthContext)
12. pages/EntrevistasPage.jsx       (depende de entrevistas.service + AuthContext)
13. pages/EntrevistaDetalle.jsx     (depende de entrevistas.service + AuthContext)
14. pages/EntrevistaForm.jsx        (depende de entrevistas + postulantes service)
15. pages/NotFound.jsx              (no depende de nada)
```

---

## 4. Archivos a implementar

### 4.1 `config/axios.js`

**Propósito:** Instancia Axios compartida por todos los servicios. Nadie más importa `axios` directamente.

**Debe tener:**
- `baseURL` leída desde variable de entorno `VITE_API_URL`
- `timeout` de 5000ms
- Header `Content-Type: application/json`
- **Interceptor de request:** agarra el token de `localStorage` y lo agrega como `Authorization: Bearer <token>` en cada llamada automáticamente
- **Interceptor de response:** captura errores globalmente. Si recibe `401`, limpia localStorage y redirige a `/login`

**Variable de entorno necesaria** — crear archivo `.env` en la raíz de `Frontend/`:
```
VITE_API_URL=http://localhost:3001/api
```

> ⚠️ Agregar `.env` al `.gitignore` para no subir credenciales al repo.

---

### 4.2 `services/auth.service.js`

**Propósito:** Todas las operaciones de autenticación en un solo lugar.

**Funciones a implementar:**

| Función | Método HTTP | Endpoint | Qué hace |
|---|---|---|---|
| `login(email, password)` | POST | `/auth/login` | Llama a la API, guarda token y usuario en localStorage, retorna datos |
| `register(nombre, email, password, rol)` | POST | `/auth/register` | Registra nuevo usuario |
| `logout()` | — | — | Borra token y usuario de localStorage |
| `getUsuarioGuardado()` | — | — | Lee y parsea el usuario de localStorage |
| `getToken()` | — | — | Retorna el token de localStorage |
| `estaAutenticado()` | — | — | Retorna true si hay token |

**Qué guarda en localStorage:**
- `token` → el JWT como string
- `usuario` → el objeto usuario como JSON string

---

### 4.3 `services/entrevistas.service.js`

**Propósito:** Todas las llamadas HTTP relacionadas a entrevistas.

**Funciones a implementar:**

| Función | Método | Endpoint | Params/Body |
|---|---|---|---|
| `listar(params)` | GET | `/entrevistas` | `{ fecha, estado, entrevistadorId, postulanteId, page, limit, sortBy, order }` |
| `resumen()` | GET | `/entrevistas/resumen` | — |
| `obtener(id)` | GET | `/entrevistas/:id` | — |
| `historial(id)` | GET | `/entrevistas/:id/historial` | — |
| `crear(entrevista)` | POST | `/entrevistas` | body con todos los campos |
| `editar(id, cambios)` | PUT | `/entrevistas/:id` | body con campos a modificar |
| `cancelar(id)` | PATCH | `/entrevistas/:id/cancelar` | — |
| `realizar(id, observaciones)` | PATCH | `/entrevistas/:id/realizar` | `{ observaciones }` |
| `reprogramar(id, nuevosDatos)` | PATCH | `/entrevistas/:id/reprogramar` | body con nueva fecha/horario |

> ⚠️ Todos los endpoints de escritura requieren JWT — el interceptor de `axios.js` lo manda automáticamente.

---

### 4.4 `services/postulantes.service.js`

**Propósito:** Llamadas HTTP para postulantes (principalmente para llenar el select del formulario).

**Funciones a implementar:**

| Función | Método | Endpoint | Params |
|---|---|---|---|
| `listar(params)` | GET | `/postulantes` | `{ estado, page, limit }` |
| `obtener(id)` | GET | `/postulantes/:id` | — |

---

### 4.5 `context/AuthContext.jsx`

**Propósito:** Estado global de autenticación accesible desde cualquier componente sin pasar props.

**Estado que maneja:**
- `usuario` → objeto con `{ id, nombre, email, rol }` o `null`
- `cargando` → boolean para mostrar estado de carga durante login/register
- `error` → mensaje de error o `null`

**Funciones que expone:**
- `login(email, password)` → llama a auth.service, actualiza `usuario`
- `register(nombre, email, password, rol)` → llama a auth.service
- `logout()` → limpia todo y setea `usuario` a null

**Helpers de rol que expone** (derivados de `usuario.rol`):
- `esAdmin` → `usuario?.rol === 'admin'`
- `esRRHH` → `usuario?.rol === 'rrhh'`
- `esEntrevistador` → `usuario?.rol === 'entrevistador'`
- `puedeGestionar` → `esAdmin || esRRHH` (puede crear, editar, cancelar)
- `estaAutenticado` → `!!usuario`

**Hook personalizado a exportar:**
```js
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
```

**Inicialización:** al montar, leer el usuario guardado en localStorage con `auth.service.getUsuarioGuardado()` para persistir la sesión al recargar la página.

---

### 4.6 `hooks/useAsync.js`

**Propósito:** Hook reutilizable que envuelve cualquier función asíncrona y expone estados de carga, error y datos. Lo van a usar Andrés y vos en las páginas.

**Parámetros:**
- `fn` → función asíncrona a ejecutar
- `deps` → dependencias (como `useEffect`)
- `ejecutarInmediatamente` → si ejecuta al montar (default: `true`)

**Retorna:**
```js
{ datos, cargando, error, ejecutar, setDatos }
```

- `datos` → resultado de la función
- `cargando` → boolean
- `error` → mensaje de error o null
- `ejecutar` → función para re-ejecutar manualmente
- `setDatos` → para actualizar datos localmente sin refetch

---

### 4.7 `components/ProtectedRoute.jsx`

**Propósito:** Componente que envuelve rutas y controla el acceso.

**Props:**
- `children` → el componente a renderizar si tiene acceso
- `roles` → array de roles permitidos (vacío = cualquier autenticado)

**Lógica:**
1. Si `!estaAutenticado` → redirigir a `/login` guardando la ruta original en `state.from`
2. Si `roles.length > 0` y el rol del usuario no está en la lista → redirigir a `/403`
3. Si pasa ambas validaciones → renderizar `children`

**Importante:** usar `<Navigate>` de react-router-dom, no `window.location`.

---

### 4.8 `routes/AppRouter.jsx`

**Propósito:** Define todas las rutas de la aplicación.

**Rutas a definir:**

| Path | Componente | Protección |
|---|---|---|
| `/login` | `LoginPage` | Pública |
| `/registro` | `RegisterPage` | Pública |
| `/` | Redirect a `/entrevistas` | Autenticado |
| `/entrevistas` | `EntrevistasPage` | Autenticado |
| `/entrevistas/nueva` | `EntrevistaForm modo="crear"` | `admin`, `rrhh` |
| `/entrevistas/:id` | `EntrevistaDetalle` | Autenticado |
| `/entrevistas/:id/editar` | `EntrevistaForm modo="editar"` | `admin`, `rrhh` |
| `/entrevistas/:id/reprogramar` | `EntrevistaForm modo="reprogramar"` | `admin`, `rrhh` |
| `/resumen` | `ResumenPage` | `admin`, `rrhh` |
| `/403` | `ForbiddenPage` | Pública |
| `*` | `NotFound` | Pública |

> ⚠️ La ruta comodín `*` es **obligatoria según el enunciado** y debe ir **siempre al final**.

> ⚠️ `/entrevistas/nueva` debe ir **antes** de `/entrevistas/:id` en el router, sino React Router interpreta "nueva" como un id.

---

### 4.9 `main.jsx`

**Propósito:** Punto de entrada de la app. Renderiza todo dentro de `<AuthProvider>`.

**Estructura:**
```jsx
<StrictMode>
  <AuthProvider>
    <AppRouter />
  </AuthProvider>
</StrictMode>
```

> ⚠️ `<AuthProvider>` tiene que estar por fuera de `<AppRouter>` porque las rutas necesitan acceder al contexto.

---

### 4.10 `pages/LoginPage.jsx`

**Propósito:** Pantalla de inicio de sesión.

**Campos del formulario:**
- `email` (type="email")
- `password` (type="password")

**Comportamiento:**
- Validación frontend: ambos campos requeridos
- Al hacer submit: llama a `login()` del AuthContext
- Si login es exitoso: redirigir a la ruta original (guardada en `state.from`) o a `/entrevistas`
- Si hay error: mostrar mensaje visible **cerca del formulario** (no en consola)
- Mientras carga: deshabilitar el botón y mostrar texto "Ingresando..."
- Link a `/registro`

**Estados a manejar:**
- `cargando` (del AuthContext)
- `error` (local, mensaje de la API)

---

### 4.11 `pages/RegisterPage.jsx`

**Propósito:** Pantalla de registro de nuevo usuario.

**Campos del formulario:**
- `nombre` (requerido)
- `email` (requerido, tipo email)
- `password` (requerido, mínimo 6 caracteres)
- `rol` (select: entrevistador / rrhh / admin)

**Comportamiento:**
- Validación frontend antes de llamar a la API
- Al registrar exitosamente: mostrar mensaje de éxito y redirigir a `/login`
- Errores de API visibles en pantalla
- Link a `/login`

---

### 4.12 `pages/EntrevistasPage.jsx`

**Propósito:** Listado principal de entrevistas con filtros y paginación.

**Filtros (se mandan como query params a la API):**
- `fecha` (date input)
- `estado` (select: todos / programada / reprogramada / realizada / cancelada)
- `entrevistadorId` (input texto)
- `postulanteId` (input texto)

**Parámetros de paginación y orden:**
- `page` (default: 1)
- `limit` (default: 10)
- `sortBy` (default: 'fecha')
- `order` (default: 'ASC')

> ⚠️ Los filtros y paginación se resuelven **en el backend**. El frontend solo manda los params y muestra los resultados. No filtrar en el frontend.

**Tabla — columnas mínimas:**
- Postulante (nombre + apellido)
- Entrevistador (nombre)
- Fecha
- Horario (horaInicio – horaFin)
- Modalidad
- Estado (con badge de color)
- Acciones (botón "Ver" que navega a `/entrevistas/:id`)

**Botón "Nueva entrevista":** visible solo si `puedeGestionar` (admin o rrhh).

**Estados de UI:**
- Cargando
- Error (con botón reintentar)
- Vacío (sin resultados)
- Con datos (tabla + paginación)

---

### 4.13 `pages/EntrevistaDetalle.jsx`

**Propósito:** Vista completa de una entrevista con acciones según rol.

**Obtiene el id con `useParams()`** — obligatorio según el enunciado.

**Datos a mostrar:**
- Todos los campos de la entrevista
- Nombre del postulante (no solo el id)
- Nombre del entrevistador (no solo el id)

**Acciones según rol:**

| Acción | Quién puede |
|---|---|
| Editar datos | admin, rrhh |
| Reprogramar | admin, rrhh |
| Cancelar | admin, rrhh |
| Marcar como realizada + observaciones | entrevistador asignado |

> ⚠️ Las acciones solo se muestran si la entrevista está en estado `programada` o `reprogramada`. No se puede modificar una entrevista `realizada` (salvo observaciones).

**Historial:** sección al final del detalle. La implementación visual detallada le toca a Andrés, pero vos tenés que hacer la llamada a `entrevistasService.historial(id)` y pasar los datos.

---

### 4.14 `pages/EntrevistaForm.jsx`

**Propósito:** Pantalla unificada para crear, editar y reprogramar. El `modo` se recibe como prop desde el router.

**Campos del formulario:**

| Campo | Tipo | Obligatorio | Validación |
|---|---|---|---|
| `postulanteId` | select | Sí | Debe seleccionarse uno |
| `entrevistadorId` | number input | Sí | Requerido |
| `fecha` | date | Sí | Requerida |
| `horaInicio` | time | Sí | Requerida |
| `horaFin` | time | Sí | Debe ser mayor que horaInicio |
| `modalidad` | select (presencial/virtual) | Sí | — |
| `ubicacionOLink` | text | Sí | Si virtual: "link requerido". Si presencial: "ubicación requerida" |
| `observaciones` | textarea | No | — |

**Comportamiento según modo:**
- `crear` → form vacío, llama a `entrevistasService.crear()`
- `editar` → precarga datos del id en la URL, llama a `entrevistasService.editar()`
- `reprogramar` → precarga datos, llama a `entrevistasService.reprogramar()`

**El select de postulantes** debe cargar desde `postulantesService.listar()` — solo postulantes en estado `nuevo` o `en_proceso`.

**Errores:**
- Errores de validación frontend: mostrar debajo de cada campo
- Errores de la API: mostrar en banner visible cerca del botón submit

---

### 4.15 `pages/NotFound.jsx`

**Propósito:** Página 404 para rutas inexistentes y página 403 para acceso denegado.

**404:** Título, mensaje descriptivo, botón para volver a `/entrevistas`.

**403:** Título, mensaje explicando que no tiene permisos, botón para volver.

Podés exportar ambas desde el mismo archivo o crear `ForbiddenPage.jsx` por separado.

---

## 5. Requisitos del enunciado — Checklist

Usá esto para verificar antes de hacer el PR:

### Routing
- [ ] React Router implementado con `<BrowserRouter>`
- [ ] Ruta comodín `*` al final del router
- [ ] `useParams()` en `EntrevistaDetalle`
- [ ] Rutas protegidas que **impiden navegación**, no solo ocultan botones

### Autenticación
- [ ] Login y registro funcionales desde el frontend
- [ ] JWT guardado en localStorage
- [ ] JWT enviado como `Authorization: Bearer <token>` en cada request
- [ ] Al recibir 401, limpiar sesión y redirigir a login
- [ ] Sesión persiste al recargar (leer de localStorage al iniciar)

### Servicios Axios
- [ ] Una instancia Axios compartida (no importar axios directamente en componentes)
- [ ] Servicios separados por recurso (auth, entrevistas, postulantes)
- [ ] Sin llamadas HTTP mezcladas dentro de los componentes

### Formularios y validaciones
- [ ] Validaciones visibles en pantalla (no solo en consola)
- [ ] Errores de API visibles cerca de la acción que falló
- [ ] Campos deshabilitados mientras carga

### Roles y permisos
- [ ] Acciones visibles según rol (crear/editar/cancelar solo para admin y rrhh)
- [ ] Marcar como realizada solo para el entrevistador asignado
- [ ] Rutas protegidas por rol redirigen a `/403`

### General
- [ ] Estados de carga, vacío y error en listado y detalle
- [ ] Paginación implementada (page, limit)
- [ ] Filtros enviados como params a la API (no filtrar en frontend)

---

## 6. Integración con el resto del grupo

### Lo que necesitás de Fran (auth + backend base)
- Endpoints funcionando: `POST /api/auth/login` y `POST /api/auth/register`
- Formato de respuesta del login: `{ token, usuario: { id, nombre, email, rol } }`
- Confirmar el puerto del backend (default: 3001)

### Lo que necesitás de Tobi (dominio backend)
- Endpoints de entrevistas funcionando con los formatos del enunciado
- Respuestas de error con formato `{ "error": "mensaje descriptivo" }`

### Lo que Andrés necesita de vos
- `useAsync.js` implementado y exportado correctamente
- `AuthContext` con `useAuth()` hook exportado
- `entrevistasService` completo (él lo va a usar en el resumen y filtros)
- Páginas con estructura base lista para que él agregue componentes encima
- `ProtectedRoute` funcionando para que pueda proteger `/resumen`

### Acuerdo de nombrado con Andrés
Antes de empezar, acordar:
- Nombres de clases CSS para badges de estado
- Estructura del objeto entrevista que devuelve la API
- Cómo se llama el hook: `useAuth()` (confirmado)

---

## 7. Errores frecuentes a evitar

| Error | Cómo evitarlo |
|---|---|
| `useAuth` fuera de `<AuthProvider>` | Asegurarse que `<AuthProvider>` envuelva todo en `main.jsx` |
| Ruta `/entrevistas/:id` captura "nueva" | Poner `/entrevistas/nueva` antes de `/entrevistas/:id` en el router |
| Filtrar entrevistas en el frontend | Siempre mandar params a la API, nunca filtrar el array local |
| Llamar axios directamente en un componente | Siempre usar los servicios de `services/` |
| JWT no se manda en requests protegidos | El interceptor en `axios.js` lo hace automático, no hace falta agregarlo a mano |
| `Cannot read properties of null` al leer usuario | Usar optional chaining: `usuario?.rol` |
| Rutas protegidas solo ocultan botones | `ProtectedRoute` debe usar `<Navigate>`, no `display: none` |
| Variables de entorno no disponibles | Las variables deben empezar con `VITE_` para que Vite las exponga |
