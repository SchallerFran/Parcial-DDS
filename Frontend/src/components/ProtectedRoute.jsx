import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function ProtectedRoute({ children, roles = [] }) {
    const { estaAutenticado, usuario } = useAuth()

    if (!estaAutenticado) {
        return <Navigate to="/login" replace />
    }

    if (roles.length > 0 && !roles.includes(usuario?.rol)) {
        return <Navigate to="/403" replace />
    }

    return children
}