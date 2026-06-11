import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { login, error, cargando } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await login(email, password)
            navigate("/entrevistas")
        } catch (err) {
            console.error("Error al iniciar sesión:", err)
        }
    }

    return (
        <div style={{ padding: "2rem", maxWidth: "400px", margin: "2rem auto" }}>
            <h1>Iniciar Sesión</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="email">Email: </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: "100%", padding: "0.5rem" }}
                    />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="password">Contraseña: </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: "100%", padding: "0.5rem" }}
                    />
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button
                    type="submit"
                    disabled={cargando}
                    style={{
                        width: "100%",
                        padding: "0.75rem",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    {cargando ? "Cargando..." : "Iniciar Sesión"}
                </button>
            </form>
            <p style={{ marginTop: "1rem", textAlign: "center" }}>
                ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
            </p>
        </div>
    )
}
