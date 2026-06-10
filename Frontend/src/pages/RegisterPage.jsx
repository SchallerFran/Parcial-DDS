import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function RegisterPage() {
    const [form, setForm] = useState({
        nombre: "",
        email: "",
        password: "",
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
            await register(form.nombre, form.email, form.password, form.rol)
            navigate("/login")
        } catch (err) {
            console.error("Error al registrarse:", err)
        }
    }

    return (
        <div style={{ padding: "2rem", maxWidth: "400px", margin: "2rem auto" }}>
            <h1>Registrarse</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="nombre">Nombre: </label>
                    <input
                        id="nombre"
                        name="nombre"
                        type="text"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "0.5rem" }}
                    />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="email">Email: </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "0.5rem" }}
                    />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="password">Contraseña: </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "0.5rem" }}
                    />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="rol">Rol: </label>
                    <select
                        id="rol"
                        name="rol"
                        value={form.rol}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "0.5rem" }}
                    >
                        <option value="entrevistador">Entrevistador</option>
                        <option value="rrhh">RRHH</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button
                    type="submit"
                    disabled={cargando}
                    style={{
                        width: "100%",
                        padding: "0.75rem",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    {cargando ? "Registrando..." : "Registrarse"}
                </button>
            </form>
            <p style={{ marginTop: "1rem", textAlign: "center" }}>
                ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
            </p>
        </div>
    )
}
