import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

/**
 * ProtectedRoute: Ruta que requiere autenticación
 * Opcionalmente puede validar que el usuario tenga un rol específico
 */
export default function ProtectedRoute({ children, requiereRol = null }) {
    const { estaAutenticado, usuario } = useAuth()

    if (!estaAutenticado) {
        return <Navigate to="/login" replace />
    }

    if (requiereRol && usuario?.rol !== requiereRol) {
        return <Navigate to="/no-autorizado" replace />
    }

    return children
}
