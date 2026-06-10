# Agenda de Entrevistas — TP Previo Parcial 2 DDS 2026
**Curso:** 3K5 | **Fecha límite:** 13/06 23:55 hs | **Responsable frontend:** Fati

---

## Estado general

| Área | Estado | % |
|---|---|---|
| Frontend | ✅ En construcción | 90% |
| Backend | ❌ No iniciado | 0% |
| Integración | ⏳ Espera backend | 0% |
| Tests | ⏳ Espera backend | 0% |
| Documentación | ✅ Completa | 100% |

---

## Distribución del grupo

| Integrante | Responsabilidad |
|---|---|
| **Fran** | Auth backend + infraestructura base: registro, login, JWT, middlewares, seed |
| **Tobi** | Dominio backend: servicios de entrevistas, validaciones, endpoints REST |
| **Walter** | Tests Jest/Supertest (10 casos del enunciado) + endpoints de postulantes |
| **Fati** | Frontend core: AuthContext, Axios, pantallas principales, React Router |
| **Andrés** | Frontend features: filtros, panel resumen, historial, manejo de errores |

---

## Arquitectura

```
Frontend (React + Vite)          Backend (Express + Sequelize)
src/                             src/
├── config/axios.js              ├── config/database.js
├── services/                    ├── models/
│   ├── auth.service.js          ├── routes/
│   ├── entrevistas.service.js   ├── controllers/
│   └── postulantes.service.js   ├── services/
├── context/AuthContext.jsx      ├── middlewares/
├── hooks/useAsync.js            ├── seeders/
├── components/                  └── app.js
│   ├── ProtectedRoute.jsx
│   └── Navbar.jsx
├── routes/AppRouter.jsx
├── pages/
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── EntrevistasPage.jsx
│   ├── EntrevistaDetalle.jsx
│   ├── EntrevistaForm.jsx
│   ├── ResumenPage.jsx
│   └── NotFound.jsx
├── App.jsx
└── main.jsx
```

---

## Rutas frontend

| Path | Componente | Acceso |
|---|---|---|
| `/login` | LoginPage | Público |
| `/registro` | RegisterPage | Público |
| `/entrevistas` | EntrevistasPage | Autenticado |
| `/entrevistas/nueva` | EntrevistaForm (crear) | admin, rrhh |
| `/entrevistas/:id` | EntrevistaDetalle | Autenticado |
| `/entrevistas/:id/editar` | EntrevistaForm (editar) | admin, rrhh |
| `/entrevistas/:id/reprogramar` | EntrevistaForm (reprogramar) | admin, rrhh |
| `/resumen` | ResumenPage | admin, rrhh |
| `/403` | ForbiddenPage | Público |
| `*` | NotFound | Público |

> ⚠️ `/entrevistas/nueva` debe ir **antes** de `/entrevistas/:id` en el router.  
> ⚠️ La ruta `*` siempre al **final**.

---

## Rutas backend

| Método | Endpoint | Acceso |
|---|---|---|
| POST | `/api/auth/register` | Público |
| POST | `/api/auth/login` | Público |
| GET | `/api/postulantes` | Autenticado |
| GET | `/api/entrevistas` | Autenticado |
| GET | `/api/entrevistas/resumen` | admin, rrhh |
| GET | `/api/entrevistas/:id` | Autenticado |
| GET | `/api/entrevistas/:id/historial` | Autenticado |
| POST | `/api/entrevistas` | admin, rrhh |
| PUT | `/api/entrevistas/:id` | admin, rrhh |
| PATCH | `/api/entrevistas/:id/cancelar` | admin, rrhh |
| PATCH | `/api/entrevistas/:id/realizar` | entrevistador asignado |
| PATCH | `/api/entrevistas/:id/reprogramar` | admin, rrhh |

---

## Estado global (AuthContext)

```js
{
  usuario: { id, nombre, email, rol },
  cargando: boolean,
  error: string | null,

  // Métodos
  login(email, password),
  register(nombre, email, password, rol),
  logout(),

  // Helpers de rol
  estaAutenticado,   // !!usuario
  esAdmin,           // rol === "admin"
  esRRHH,            // rol === "rrhh"
  esEntrevistador,   // rol === "entrevistador"
  puedeGestionar,    // esAdmin || esRRHH
}
```

---

## Flujo de autenticación

```
LoginPage → auth.service.login() → POST /api/auth/login
                                        ↓
                               { token, usuario }
                                        ↓
                               localStorage.setItem()
                                        ↓
                               AuthContext.setUsuario()
                                        ↓
                               Redirige a /entrevistas
```

El interceptor de Axios agrega `Authorization: Bearer <token>` automáticamente en cada request. Si el backend responde 401, limpia localStorage y redirige a `/login`.

---

## Estados de entrevista

```
PROGRAMADA ──→ REALIZADA
     │
     ├──→ CANCELADA
     │
     └──→ REPROGRAMADA ──→ REALIZADA
                    └──→ CANCELADA
```

No se puede modificar una entrevista `realizada` (salvo observaciones).

---

## Validaciones de negocio (backend)

| Regla | Error esperado |
|---|---|
| Postulante no existe | 404 |
| Postulante en estado `rechazado` o `contratado` | 400 |
| Entrevistador con horario superpuesto | 400 |
| `horaFin` <= `horaInicio` | 400 |
| Modalidad virtual sin link | 400 |
| Modalidad presencial sin ubicación | 400 |
| Sin JWT | 401 |
| Rol insuficiente | 403 |

Todas las respuestas de error deben tener formato `{ "error": "mensaje descriptivo" }`.

---

## Credenciales de prueba (mock — mientras no hay backend)

```
Email:    fati@test.com
Password: 123456
Rol:      admin
```

El mock está en `AuthContext.jsx` marcado con comentarios. Cuando el backend esté listo, se borra el bloque mock y se descomenta la llamada real.

---

## Checklist frontend (Fati)

### Archivos
- [x] `config/axios.js` — instancia con interceptores JWT
- [x] `services/auth.service.js`
- [x] `services/entrevistas.service.js`
- [x] `services/postulantes.service.js`
- [x] `context/AuthContext.jsx`
- [x] `hooks/useAsync.js`
- [x] `components/ProtectedRoute.jsx`
- [x] `components/Navbar.jsx`
- [x] `routes/AppRouter.jsx`
- [x] `pages/LoginPage.jsx`
- [x] `pages/RegisterPage.jsx`
- [x] `pages/EntrevistasPage.jsx`
- [x] `pages/EntrevistaDetalle.jsx`
- [x] `pages/EntrevistaForm.jsx`
- [x] `pages/ResumenPage.jsx`
- [x] `pages/NotFound.jsx`
- [x] `main.jsx`
- [x] `App.jsx`

### Requisitos del enunciado
- [ ] JWT enviado como `Authorization: Bearer <token>` *(interceptor listo, falta backend)*
- [ ] `useParams()` en EntrevistaDetalle
- [ ] Ruta comodín `*` al final del router
- [ ] Rutas protegidas que impiden navegación (no solo ocultan botones)
- [ ] Servicios Axios separados por recurso, sin llamadas HTTP en componentes
- [ ] Validaciones visibles en formularios
- [ ] Errores de API visibles cerca de la acción que falló
- [ ] Filtros enviados como params a la API (no filtrar en frontend)
- [ ] Paginación: `page`, `limit`, `sortBy`, `order`
- [ ] Sesión persiste al recargar (leer de localStorage al iniciar)

---

## Checklist backend (Fran + Tobi + Walter)

- [ ] Express setup con `app.js`, `server.js`, `.env`
- [ ] `express.Router()` en archivos separados por recurso
- [ ] Middleware JWT (`auth.middleware.js`)
- [ ] Middleware de roles (`roles.middleware.js`)
- [ ] Middleware de errores con firma `(err, req, res, next)` — después de todas las rutas
- [ ] Middleware de validación de entrada
- [ ] Modelos Sequelize: Usuario, Postulante, Entrevista, HistorialEntrevista
- [ ] Asociaciones entre modelos
- [ ] Seed: 8 postulantes, 3 entrevistadores, 1 admin/rrhh, 12 entrevistas
- [ ] Todas las rutas del enunciado implementadas
- [ ] Validaciones de negocio en servicios (no en controllers ni formularios)
- [ ] Historial automático al crear, editar, reprogramar, cancelar, realizar
- [ ] Paginación y ordenamiento en el listado
- [ ] GET `/api/entrevistas/resumen` con métricas del día
- [ ] Tests Jest + Supertest (10 casos obligatorios)

---

## Lo que Andrés necesita de Fati

- `useAsync.js` exportado correctamente
- `useAuth()` hook disponible desde AuthContext
- `entrevistasService` completo (lo usa en resumen y filtros)
- `ProtectedRoute` funcionando para proteger `/resumen`
- Páginas con estructura base lista para agregar componentes encima

---

## Cronograma

| Fecha | Tarea | Responsable |
|---|---|---|
| 9/6 | Frontend base | Fati ✅ |
| 10/6 | Backend auth + DB setup | Fran |
| 11/6 | CRUD entrevistas + validaciones | Tobi |
| 12/6 | Tests + integración frontend-backend | Walter + todo el grupo |
| 13/6 23:55 | Entrega final | Todos |
| 14-15/6 | Review entre pares | Otro grupo |

---

## Cómo levantar el proyecto

```bash
# Frontend
cd Frontend
npm install
npm run dev
# → http://localhost:5173

# Backend (cuando esté listo)
cd Backend
npm install
node server.js
# → http://localhost:3001
```

Variable de entorno necesaria en `Frontend/.env`:
```
VITE_API_URL=http://localhost:3001/api
```
