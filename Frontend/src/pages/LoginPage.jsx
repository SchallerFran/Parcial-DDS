import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [recuerdame, setRecuerdame] = useState(false)
    
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
        <div className="auth-container">
            <div className="auth-card">
                
                <h1 style={{ textAlign: "center" }}>Iniciar Sesión</h1>
                
                {error && <div className="error-msg">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    {/* Reemplazamos los labels por placeholders*/}
                    <div style={{ marginBottom: "1rem" }}>
                        <input
                            id="email"
                            type="email"
                            placeholder="Nombre de usuario o Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div style={{ marginBottom: "1rem" }}>
                        <input
                            id="password"
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Agregamos el Checkbox de Recuérdame */}
                    <div className="checkbox-container">
                        <input
                            type="checkbox"
                            id="recuerdame"
                            checked={recuerdame}
                            onChange={(e) => setRecuerdame(e.target.checked)}
                        />
                        <label htmlFor="recuerdame" style={{ margin: 0, cursor: "pointer" }}>
                            Recuérdame
                        </label>
                    </div>

                    {/* El botón ahora usa la clase btn-glow para el efecto neón */}
                    <button
                        type="submit"
                        className="btn-glow"
                        disabled={cargando}
                    >
                        {cargando ? "Cargando..." : "Iniciar Sesión"}
                    </button>
                </form>
                
                {/* Aplicamos la clase auth-links solo para el registro */}
                <div className="auth-links">
                    <p style={{ fontSize: "0.9rem" }}>
                        ¿No tenés cuenta? <Link to="/registro" style={{ fontWeight: "600" }}>Registrate acá</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}