# 🚀 Frontend - Agenda de Entrevistas DDS

## 📋 Descripción

Frontend React + Vite para la aplicación de agenda de entrevistas. Incluye autenticación, routing protegido, formularios con validaciones, listado con filtros y navegación completa.

**Estado:** ✅ Listo para integración con backend

---

## 🔧 Requisitos

- Node.js 18+
- npm 9+

---

## 📦 Instalación

```bash
cd Frontend
npm install
```

---

## 🏃 Ejecución

### Desarrollo
```bash
npm run dev
```
Abre: `http://localhost:5173`

### Build
```bash
npm run build
```

---

## 🧪 Credenciales de Prueba (MOCK)

```
Email:    fati@test.com
Password: 123456
```

---

## 📁 Estructura

```
src/
├── components/          # ProtectedRoute, Navbar
├── config/              # axio.jsx (Axios configurado)
├── context/             # AuthContext (estado global)
├── hooks/               # useAsync
├── pages/               # Login, Register, Entrevistas, etc.
├── routes/              # AppRouter
├── services/            # auth, entrevistas, postulantes
└── App.jsx, main.jsx
```

---

## 🛣️ Rutas

- `/login` - Autenticación
- `/registro` - Registro
- `/entrevistas` - Listado (protegido)
- `/entrevistas/:id` - Detalle (protegido)
- `/entrevistas/crear` - Crear (protegido, solo admin/rrhh)
- `/resumen` - Dashboard (protegido, solo admin/rrhh)

---

## ✅ Funcionalidades

- ✅ Autenticación y registro
- ✅ Routing protegido por rol
- ✅ CRUD de entrevistas (UI + servicios listos)
- ✅ Filtros en listado
- ✅ Validaciones de formularios
- ✅ LocalStorage persistencia
- ✅ Navbar con logout

---

## 🔌 Backend

Configurar en `src/config/axio.jsx`:
```javascript
baseURL: "http://localhost:3000/api"
```

Servicios listos para consumir endpoints.

---

**Responsable:** Fati  
**Última actualización:** 9 de junio 2026  
**Estado:** ✅ Listo para integración
