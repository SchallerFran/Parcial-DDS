import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Navbar from "./components/Navbar"
import { useAuth } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"

// Páginas públicas
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import NotFound from "./pages/NotFound"

// Páginas protegidas
import EntrevistasPage from "./pages/EntrevistasPage"
import EntrevistaDetalle from "./pages/EntrevistaDetalle"
import EntrevistaForm from "./pages/EntrevistaForm"
import ResumenPage from "./pages/ResumenPage"

export default function App() {
  const { estaAutenticado, usuario } = useAuth()

  return (
    <BrowserRouter>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {estaAutenticado && <Navbar />}
        <main style={{ flex: 1 }}>
          <Routes>
            {/* Redirección raíz */}
            <Route path="/" element={estaAutenticado ? <Navigate to="/entrevistas" /> : <Navigate to="/login" />} />

            {/* Rutas públicas */}
            <Route 
              path="/login" 
              element={estaAutenticado ? <Navigate to="/entrevistas" /> : <LoginPage />} 
            />
            <Route 
              path="/registro" 
              element={estaAutenticado ? <Navigate to="/entrevistas" /> : <RegisterPage />} 
            />

            {/* Rutas protegidas - acceso general */}
            <Route
              path="/entrevistas"
              element={
                <ProtectedRoute>
                  <EntrevistasPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/entrevistas/:id"
              element={
                <ProtectedRoute>
                  <EntrevistaDetalle />
                </ProtectedRoute>
              }
            />
            <Route
              path="/entrevistas/crear"
              element={
                <ProtectedRoute>
                  <EntrevistaForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/entrevistas/:id/editar"
              element={
                <ProtectedRoute>
                  <EntrevistaForm />
                </ProtectedRoute>
              }
            />

            {/* Rutas protegidas - solo admin/rrhh */}
            <Route
              path="/resumen"
              element={
                <ProtectedRoute>
                  {usuario?.rol === "admin" || usuario?.rol === "rrhh" ? (
                    <ResumenPage />
                  ) : (
                    <Navigate to="/entrevistas" />
                  )}
                </ProtectedRoute>
              }
            />

            {/* Ruta 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
