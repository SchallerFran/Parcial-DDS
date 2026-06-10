import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Navbar() {
    const { usuario, logout, puedeGestionar, estaAutenticado } = useAuth()
    const navigate = useNavigate()

    if (!estaAutenticado) {
        return null
    }

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    return (
        <nav
            style={{
                backgroundColor: "#2c3e50",
                padding: "1rem 2rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
        >
            <div style={{ display: "flex", gap: "2rem" }}>
                <Link
                    to="/entrevistas"
                    style={{
                        color: "white",
                        textDecoration: "none",
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                    }}
                >
                    📅 Entrevistas
                </Link>
                {puedeGestionar && (
                    <Link
                        to="/resumen"
                        style={{
                            color: "white",
                            textDecoration: "none",
                            fontWeight: "500",
                        }}
                    >
                        📊 Resumen
                    </Link>
                )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span style={{ color: "white" }}>
                    {usuario?.nombre} <span style={{ fontSize: "0.85rem", opacity: 0.8 }}>({usuario?.rol})</span>
                </span>
                <button
                    onClick={handleLogout}
                    style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#e74c3c",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Logout
                </button>
            </div>
        </nav>
    )
}
