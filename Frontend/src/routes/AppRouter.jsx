import { Routes, Route, Navigate } from "react-router-dom"
import ProtectedRoute from "../components/ProtectedRoute"
import { useAuth } from "../context/AuthContext"
import Navbar from "../components/Navbar"

// Páginas públicas
import LoginPage from "../pages/LoginPage"
import RegisterPage from "../pages/RegisterPage"
import NotFound from "../pages/NotFound"

// Páginas protegidas
import EntrevistasPage from "../pages/EntrevistasPage"
import EntrevistaDetalle from "../pages/EntrevistaDetalle"
import EntrevistaForm from "../pages/EntrevistaForm"
import HistorialEntrevista from "../pages/HistorialEntrevista"
import ResumenPage from "../pages/ResumenPage"

export default function AppRouter() {
    const { estaAutenticado } = useAuth()

    return (
        <>
        {estaAutenticado && <Navbar />}
            <Routes>
                {/* Redirección raíz */}
                <Route path="/" element={
                estaAutenticado ? <Navigate to="/entrevistas" /> : <Navigate to="/login" />
                } />

                {/* Rutas públicas — redirigen si ya está autenticado */}
                <Route path="/login" element={
                estaAutenticado ? <Navigate to="/entrevistas" /> : <LoginPage />
                } />
                <Route path="/registro" element={
                estaAutenticado ? <Navigate to="/entrevistas" /> : <RegisterPage />
                } />

                {/* Rutas protegidas — cualquier autenticado */}
                <Route path="/entrevistas" element={
                <ProtectedRoute><EntrevistasPage /></ProtectedRoute>
                } />

                {/* ⚠️ /nueva ANTES que /:id para que no lo interprete como id */}
                <Route path="/entrevistas/nueva" element={
                <ProtectedRoute roles={["admin", "rrhh"]}>
                    <EntrevistaForm />
                </ProtectedRoute>
                } />

                <Route path="/entrevistas/:id" element={
                <ProtectedRoute><EntrevistaDetalle /></ProtectedRoute>
                } />

                <Route path="/entrevistas/:id/historial" element={
                <ProtectedRoute><HistorialEntrevista /></ProtectedRoute>
                } />

                <Route path="/entrevistas/:id/editar" element={
                <ProtectedRoute roles={["admin", "rrhh"]}>
                    <EntrevistaForm />
                </ProtectedRoute>
                } />

                {/* Solo admin o rrhh */}
                <Route path="/resumen" element={
                <ProtectedRoute roles={["admin", "rrhh"]}>
                    <ResumenPage />
                </ProtectedRoute>
                } />

                {/* Errores */}
                <Route path="/403" element={
                <div style={{ padding: "4rem", textAlign: "center" }}>
                    <h1>403</h1>
                    <p>No tenés permiso para acceder a esta página.</p>
                </div>
                } />

                {/* Comodín — SIEMPRE al final */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    )
}