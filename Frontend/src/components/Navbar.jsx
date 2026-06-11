import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function Navbar() {
    // Traemos los datos del usuario y la función para cerrar sesión desde tu contexto
    const { usuario, logout, puedeGestionar, estaAutenticado } = useAuth() 
    const navigate = useNavigate()

    // Validación clave de seguridad: si no hay sesión, no mostramos nada
    if (!estaAutenticado) {
        return null
    }

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    return (
        <nav>
            <div className="nav-container">
                
                {/* Lado izquierdo: Los links de navegación */}
                <div className="nav-links">
                    {/* Usamos NavLink para que se pinte solo cuando estamos en esa ruta */}
                    <NavLink to="/entrevistas" className="nav-link">
                        🗓️ Entrevistas
                    </NavLink>
                    
                    {/* El link de resumen solo aparece si es admin o rrhh */}
                    {puedeGestionar && (
                        <NavLink to="/resumen" className="nav-link">
                            📊 Resumen
                        </NavLink>
                    )}
                </div>

                {/* Lado derecho: Info del usuario y botón de salir */}
                <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                    <div style={{ color: "var(--blanco)", fontSize: "0.9rem", fontWeight: 500, textAlign: "right" }}>
                        {/* Mostramos el nombre, y el rol en color rosado */}
                        <span>{usuario?.nombre || "Usuario"}</span>
                        <span style={{ color: "var(--rosa)", marginLeft: "0.4rem", fontSize: "0.8rem", textTransform: "lowercase" }}>
                            ({usuario?.rol || "rol"})
                        </span>
                    </div>
                    
                    <button 
                        onClick={handleLogout}
                        style={{ 
                            padding: "0.4rem 1.2rem", 
                            backgroundColor: "var(--magenta)", 
                            color: "var(--blanco)", 
                            border: "none", 
                            borderRadius: "var(--radio)", 
                            cursor: "pointer",
                            fontWeight: "600",
                            fontSize: "0.85rem",
                            transition: "background 0.2s"
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = "var(--morado-oscuro)"}
                        onMouseLeave={(e) => e.target.style.backgroundColor = "var(--magenta)"}
                    >
                        Logout
                    </button>
                </div>
                
            </div>
        </nav>
    )
}