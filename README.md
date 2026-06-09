# Sistema de Gestión de Entrevistas

Aplicación web Full Stack desarrollada para la materia **Desarrollo de Software (DDS) - UTN FRC**, destinada a la gestión integral de entrevistas laborales.

El sistema permite administrar postulantes, entrevistadores y entrevistas, aplicando reglas de negocio reales como validación de disponibilidad, control de estados, permisos por rol e historial de cambios.

---

# Integrantes

* Francisco Schaller | 98707
* Nombre Apellido
* Nombre Apellido

---

# Tecnologías Utilizadas

## Backend

* Node.js
* Express
* JWT (JSON Web Tokens)
* bcrypt
* Jest
* Supertest

## Frontend

* React
* Vite
* React Router
* Axios

## Persistencia

* JSON / SQLite / Sequelize (según implementación)

---

# Funcionalidades Implementadas

## Autenticación

* Registro de usuarios
* Inicio de sesión
* Generación de JWT
* Persistencia de sesión en frontend
* Autorización basada en roles

### Roles

#### Admin / RRHH

Puede:

* Crear entrevistas
* Editar entrevistas
* Reprogramar entrevistas
* Cancelar entrevistas
* Ver todas las entrevistas
* Acceder al panel de resumen

#### Entrevistador

Puede:

* Ver entrevistas asignadas
* Marcar entrevistas como realizadas
* Agregar observaciones

---

# Entidades

## Usuarios

| Campo        | Descripción                 |
| ------------ | --------------------------- |
| id           | Identificador               |
| nombre       | Nombre completo             |
| email        | Correo electrónico          |
| passwordHash | Contraseña hasheada         |
| rol          | entrevistador, rrhh o admin |
| activo       | Estado del usuario          |

## Postulantes

| Campo    | Descripción                              |
| -------- | ---------------------------------------- |
| id       | Identificador                            |
| nombre   | Nombre                                   |
| apellido | Apellido                                 |
| email    | Correo                                   |
| telefono | Teléfono                                 |
| puesto   | Puesto aplicado                          |
| estado   | nuevo, en_proceso, rechazado, contratado |

## Entrevistas

| Campo           | Descripción                                    |
| --------------- | ---------------------------------------------- |
| id              | Identificador                                  |
| postulanteId    | Postulante asociado                            |
| entrevistadorId | Entrevistador asignado                         |
| fecha           | Fecha                                          |
| horaInicio      | Hora de inicio                                 |
| horaFin         | Hora de finalización                           |
| modalidad       | presencial o virtual                           |
| ubicacionLink   | Ubicación física o enlace                      |
| estado          | programada, realizada, cancelada, reprogramada |
| observaciones   | Comentarios                                    |

## Historial de Entrevistas

Registra auditoría de:

* Creaciones
* Ediciones
* Reprogramaciones
* Cancelaciones
* Realizaciones

---

# Reglas de Negocio

## Validación de Horarios

No se permite crear o reprogramar entrevistas cuando:

* horaInicio >= horaFin

Ejemplo:

❌ 15:00 - 15:00

❌ 16:00 - 15:00

✅ 15:00 - 16:00

---

## Validación de Superposición

Un entrevistador no puede tener dos entrevistas superpuestas el mismo día.

Se consideran bloqueantes las entrevistas:

* programada
* reprogramada

Ejemplo:

Entrevista existente:

14:00 - 15:00

No se permite:

14:30 - 15:30

Sí se permite:

15:00 - 16:00

---

## Validación de Estado del Postulante

Solo pueden entrevistarse postulantes en:

* nuevo
* en_proceso

No se permite crear entrevistas para:

* rechazado
* contratado

---

## Validación de Modalidad

### Virtual

Debe incluir:

* Link de reunión

### Presencial

Debe incluir:

* Ubicación física

---

## Flujo de Estados

```text
programada
 ├──► realizada
 ├──► cancelada
 └──► reprogramada
           ├──► realizada
           └──► cancelada
```

Las entrevistas realizadas no pueden modificarse, excepto sus observaciones.

---

# Endpoints Principales

## Autenticación

### POST /api/auth/register

Registrar usuario.

### POST /api/auth/login

Iniciar sesión.

---

## Postulantes

### GET /api/postulantes

Listar postulantes.

---

## Entrevistas

### GET /api/entrevistas

Listado con filtros.

Parámetros:

```http
?fecha=
&estado=
&entrevistadorId=
&postulanteId=
&page=
&limit=
&sortBy=
&order=
```

### GET /api/entrevistas/:id

Detalle de entrevista.

### GET /api/entrevistas/:id/historial

Historial de cambios.

### GET /api/entrevistas/resumen

Panel resumen administrativo.

### POST /api/entrevistas

Crear entrevista.

### PUT /api/entrevistas/:id

Editar entrevista.

### PATCH /api/entrevistas/:id/cancelar

Cancelar entrevista.

### PATCH /api/entrevistas/:id/realizar

Marcar entrevista como realizada.

### PATCH /api/entrevistas/:id/reprogramar

Reprogramar entrevista.

---

# Rutas Frontend

| Ruta                         | Descripción              |
| ---------------------------- | ------------------------ |
| /login                       | Inicio de sesión         |
| /register                    | Registro                 |
| /entrevistas                 | Listado                  |
| /entrevistas/:id             | Detalle                  |
| /entrevistas/nueva           | Alta                     |
| /entrevistas/:id/editar      | Edición                  |
| /entrevistas/:id/reprogramar | Reprogramación           |
| /resumen                     | Dashboard administrativo |
| *                            | Página no encontrada     |

---

# Usuarios de Prueba

## Administrador

```text
Email: admin@dds.com
Password: admin123
```

## Entrevistador

```text
Email: entrevistador@dds.com
Password: entrevistador123
```

---

# Instalación

## Backend

```bash
cd backend
npm install
npm run dev
```

Servidor:

```text
http://localhost:3000
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Aplicación:

```text
http://localhost:5173
```

---

# Variables de Entorno

## Backend (.env)

```env
PORT=3000
JWT_SECRET=mi_clave_secreta
```

---

# Seguridad

## JWT

Las rutas protegidas requieren:

```http
Authorization: Bearer <token>
```

---

## Respuestas de Seguridad

### 401 Unauthorized

Usuario sin token.

Ejemplo:

```json
{
  "error": "Token requerido"
}
```

### 403 Forbidden

Usuario autenticado sin permisos.

Ejemplo:

```json
{
  "error": "No posee permisos para realizar esta acción"
}
```

---

# Testing

Ejecutar pruebas:

```bash
npm test
```

Casos cubiertos:

* Login válido
* Login inválido
* Listado de entrevistas
* Filtros
* Detalle existente
* Detalle inexistente
* Creación válida
* Horario inválido
* Superposición de entrevistas
* Falta de JWT
* Rol insuficiente
* Reprogramación inválida
* Modalidad sin datos requeridos

---

# Estructura del Proyecto

```text
backend/
├── src
│   ├── routes
│   ├── controllers
│   ├── services
│   ├── middlewares
│   ├── repositories
│   ├── data
│   └── tests

frontend/
├── src
│   ├── pages
│   ├── components
│   ├── services
│   ├── context
│   ├── hooks
│   └── routes
```

---

# Datos Semilla

El sistema incluye:

* 3 entrevistadores
* 1 administrador/RRHH
* 8 postulantes
* 12 entrevistas
* Historial inicial de acciones

---

# Limitaciones Conocidas

* La persistencia se realiza mediante JSON/SQLite y no contempla concurrencia distribuida.
* No se implementó recuperación de contraseña.
* No se implementó notificación por correo electrónico.
* El sistema está orientado al alcance académico solicitado por la cátedra.

---

# Decisiones de Diseño

* Las reglas de negocio se centralizan en la capa de servicios.
* Las validaciones se ejecutan tanto en frontend como en backend.
* El backend es la fuente de verdad para todas las restricciones del dominio.
* El historial de entrevistas permite trazabilidad completa de modificaciones.
* La autorización se implementa mediante JWT y control de roles.

```
```
