import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function RegisterPage() {
    const [form, setForm] = useState({
        nombre: "",
        email: "",
        password: "",
        // Dejamos el rol por defecto clavado acá en el estado para que se envíe al backend
        rol: "entrevistador",
    })
    const { register, error, cargando } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            // El backend recibe el rol "entrevistador" de forma transparente
            await register(form.nombre, form.email, form.password, form.rol)
            navigate("/login")
        } catch (err) {
            console.error("Error al registrarse:", err)
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                
                <h1 style={{ textAlign: "center" }}>Registrarse</h1>
                
                {error && <div className="error-msg">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "1rem" }}>
                        <input
                            id="nombre"
                            name="nombre"
                            type="text"
                            placeholder="Nombre completo"
                            value={form.nombre}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div style={{ marginBottom: "1rem" }}>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    {/* Le dimos un poco más de margen inferior (2rem) para compensar el espacio que dejó el Select */}
                    <div style={{ marginBottom: "2rem" }}>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Contraseña"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-glow"
                        disabled={cargando}
                    >
                        {cargando ? "Registrando..." : "Crear Cuenta"}
                    </button>
                </form>

                <div className="auth-links">
                    <p style={{ fontSize: "0.9rem" }}>
                        ¿Ya tenés cuenta? <Link to="/login" style={{ fontWeight: "600" }}>Iniciá sesión acá</Link>
                    </p>
                </div>
                
            </div>
        </div>
    )
}