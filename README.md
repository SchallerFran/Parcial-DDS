# Sistema de Gestión de Entrevistas

Aplicación web Full Stack desarrollada para la materia **Diseño de Sistemas (DDS) - UTN FRC**, destinada a la gestión integral de entrevistas laborales.

El sistema permite administrar postulantes, entrevistadores y entrevistas, aplicando reglas de negocio como validación de disponibilidad horaria, control de estados, permisos por rol e historial de auditoría.

---

## Integrantes

| Nombre | Legajo |
| --- | --- |
| Francisco Schaller | 98707 |
| Fatima Vaca | 94588 |
| Lautaro Tobias Diaz | 94528 |
| Walter Rueda | 407718 |
| Andrés Bisio | 65193 |

---

## Tecnologías

| Capa | Stack |
| --- | --- |
| Backend | Node.js, Express, Sequelize, SQLite |
| Autenticación | JWT (jsonwebtoken), bcrypt |
| Testing | Jest, Supertest |
| Frontend | React, Vite, React Router |

---

## Instrucciones de ejecución

### Requisitos previos

- Node.js v18 o superior

### Backend

```bash
cd Backend
npm install
```

Crear el archivo `.env` en la carpeta `Backend/`:

```env
JWT_SECRET=clave_secreta_super_segura
PORT=3000
```

Crear las tablas en la base de datos (solo la primera vez):

```bash
npm run sync
```

Iniciar el servidor:

```bash
npm run dev
```

El servidor queda disponible en `http://localhost:3000`.

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

---

## Usuarios de prueba

Los usuarios se crean llamando al endpoint `POST /api/auth/register`. Se sugieren los siguientes:

**Usuario RRHH / admin:**

```json
{
  "nombre": "Admin RRHH",
  "email": "admin@dds.com",
  "password": "admin123",
  "rol": "rrhh"
}
```

**Usuario entrevistador:**

```json
{
  "nombre": "Entrevistador",
  "email": "entrevistador@dds.com",
  "password": "entrevistador123",
  "rol": "entrevistador"
}
```

---

## Endpoints principales

Todas las rutas excepto `/api/auth/*` requieren el header:

```
Authorization: Bearer <token>
```

### Autenticación (públicos)

| Método | Ruta | Descripción |
| --- | --- | --- |
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesión — devuelve `{ token, usuario }` |

### Postulantes

| Método | Ruta | Roles | Descripción |
| --- | --- | --- | --- |
| GET | `/api/postulantes` | todos | Listar postulantes |
| GET | `/api/postulantes/:id` | todos | Detalle de postulante |
| POST | `/api/postulantes` | rrhh, admin | Crear postulante |
| PUT | `/api/postulantes/:id` | rrhh, admin | Editar postulante |
| DELETE | `/api/postulantes/:id` | admin | Eliminar postulante |

### Entrevistas

| Método | Ruta | Roles | Descripción |
| --- | --- | --- | --- |
| GET | `/api/entrevistas` | todos | Listar con filtros opcionales |
| GET | `/api/entrevistas/resumen` | todos | Dashboard con estadísticas |
| GET | `/api/entrevistas/:id` | todos | Detalle de entrevista |
| GET | `/api/entrevistas/:id/historial` | todos | Historial de cambios |
| POST | `/api/entrevistas` | rrhh, admin | Crear entrevista |
| PUT | `/api/entrevistas/:id` | rrhh, admin | Editar entrevista |
| PATCH | `/api/entrevistas/:id/reprogramar` | rrhh, admin | Reprogramar |
| PATCH | `/api/entrevistas/:id/cancelar` | rrhh, admin | Cancelar |
| PATCH | `/api/entrevistas/:id/realizar` | entrevistador, rrhh, admin | Marcar como realizada |

**Filtros disponibles en `GET /api/entrevistas`:**

```
?fecha=YYYY-MM-DD
&estado=programada|realizada|cancelada|reprogramada
&entrevistadorId=1
&postulanteId=post-001
&page=1
&limit=10
&sortBy=fecha
&order=ASC|DESC
```

---

## Rutas frontend

| Ruta | Descripción |
| --- | --- |
| `/login` | Inicio de sesión |
| `/register` | Registro de usuario |
| `/entrevistas` | Listado de entrevistas |
| `/entrevistas/:id` | Detalle de entrevista |
| `/entrevistas/nueva` | Alta de entrevista |
| `/entrevistas/:id/editar` | Edición de entrevista |
| `/entrevistas/:id/reprogramar` | Reprogramación de entrevista |
| `/resumen` | Dashboard administrativo |
| `*` | Página no encontrada |

---

## Reglas de negocio

### Validación de superposición por entrevistador

Un entrevistador no puede tener dos entrevistas que se solapen en fecha y horario. Se consideran bloqueantes únicamente las entrevistas en estado `programada` o `reprogramada`.

La superposición se detecta con la condición:
```
inicio_existente < fin_nueva  AND  fin_existente > inicio_nueva
```

Ejemplo:

| Entrevista existente | Solicitud | Resultado |
| --- | --- | --- |
| 14:00 — 15:00 | 14:30 — 15:30 | ❌ Superposición |
| 14:00 — 15:00 | 15:00 — 16:00 | ✅ Permitido |
| 14:00 — 15:00 | 13:00 — 14:00 | ✅ Permitido |

Esta validación aplica tanto al **crear** como al **reprogramar**.

### Estados del postulante

Solo se pueden crear entrevistas para postulantes en estado `nuevo` o `en_proceso`.

| Estado | Puede entrevistarse |
| --- | --- |
| nuevo | ✅ |
| en_proceso | ✅ |
| rechazado | ❌ |
| contratado | ❌ |

### Flujo de estados de la entrevista

```
programada
 ├──► realizada
 ├──► cancelada
 └──► reprogramada
           ├──► realizada
           └──► cancelada
```

Las entrevistas `realizadas` no pueden modificarse, excepto el campo `observaciones`.

### Validación de modalidad

| Modalidad | Campo obligatorio |
| --- | --- |
| presencial | `ubicacion` |
| virtual | `link` |

---

## Seguridad: JWT, roles y permisos

### Autenticación

El backend valida el JWT en cada request protegido mediante el middleware `auth.middleware.js`. El token debe enviarse en el header:

```
Authorization: Bearer <token>
```

Si el token está ausente o es inválido, la respuesta es `401 Unauthorized`.

### Autorización por rol

Luego de autenticar, el middleware `roles.middleware.js` verifica que el rol del usuario esté dentro de los roles permitidos para esa ruta. Si no tiene permiso, la respuesta es `403 Forbidden`.

El payload del JWT contiene `{ id, rol, nombre }` y tiene vigencia de **8 horas**.

| Respuesta | Causa |
| --- | --- |
| `401` | Sin token o token inválido/expirado |
| `403` | Token válido pero rol insuficiente |

---

## Pruebas

Las pruebas se ejecutan desde la carpeta `Backend/`:

```bash
cd Backend
npm test
```

Cobertura de los 10 casos requeridos:

| # | Caso | Archivo |
| --- | --- | --- |
| 1 | Login correcto e inválido | `auth.test.js` |
| 2 | Listado de entrevistas con y sin filtros | `entrevistas.test.js` |
| 3 | Detalle de entrevista existente e inexistente | `entrevistas.test.js` |
| 4 | Creación válida de entrevista | `entrevistas.test.js` |
| 5 | Creación inválida por horario inconsistente | `entrevistas.test.js` |
| 6 | Creación inválida por superposición | `entrevistas.test.js` |
| 7 | Acceso sin JWT a ruta protegida | `auth.test.js` |
| 8 | Acceso con JWT de entrevistador a ruta de rrhh/admin | `auth.test.js` |
| 9 | Reprogramación inválida por superposición | `entrevistas.test.js` |
| 10 | Modalidad virtual sin link / presencial sin ubicación | `entrevistas.test.js` |

---

## Limitaciones conocidas

- **Frontend incompleto:** solo existe el archivo `main.jsx`. Las rutas listadas en esta documentación corresponden al diseño planeado pero aún no implementado.
- **IDs manuales:** los modelos `Entrevista`, `Postulante` e `HistorialEntrevista` usan `id` de tipo `STRING` sin generación automática. El cliente debe proveer el ID al crear (o se debe agregar un generador UUID en el servicio).
- **Sin datos semilla:** no existe un script de seed. Los usuarios y postulantes deben crearse manualmente via API antes de poder crear entrevistas.
- **Concurrencia:** SQLite no soporta escrituras concurrentes. El sistema no es apto para múltiples instancias simultáneas.
- **Sin recuperación de contraseña:** no se implementó flujo de reset de password.
- **Sin notificaciones:** no se implementó envío de emails al programar o reprogramar entrevistas.
- **Scope académico:** el sistema está orientado al alcance definido por la cátedra.
