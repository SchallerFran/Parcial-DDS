import { useParams, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import entrevistasService from "../services/entrevistas.service"

export default function HistorialEntrevista() {
    const { id } = useParams()
    const { estaAutenticado } = useAuth()
    const [historial, setHistorial] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const cargarHistorial = async () => {
            setCargando(true)
            setError(null)
            try {
                const data = await entrevistasService.obtenerHistorial(id)
                setHistorial(data)
            } catch (err) {
                setError("No se pudo cargar el historial de la entrevista")
            } finally {
                setCargando(false)
            }
        }
        cargarHistorial()
    }, [id])

    const renderValor = (valor) => {
        if (!valor) return <em style={{ color: "#6c757d" }}>Sin datos</em>
        try {
            const parsed = JSON.parse(valor)
            return (
                <pre style={{ whiteSpace: "pre-wrap", margin: 0, fontSize: "0.9rem" }}>
                    {JSON.stringify(parsed, null, 2)}
                </pre>
            )
        } catch {
            return <span>{valor}</span>
        }
    }

    if (!estaAutenticado) {
        return <div style={{ padding: "2rem" }}>Acceso no autorizado</div>
    }

    if (cargando) {
        return <div style={{ padding: "2rem" }}>Cargando historial...</div>
    }

    return (
        <div style={{ padding: "2rem", maxWidth: "960px", margin: "0 auto" }}>
            <Link to={`/entrevistas/${id}`} style={{ color: "#007bff", textDecoration: "none", marginBottom: "1rem", display: "block" }}>
                ← Volver al detalle
            </Link>
            <h1>Historial de la Entrevista</h1>

            {error ? (
                <div style={{ color: "red", marginTop: "1rem" }}>{error}</div>
            ) : historial.length === 0 ? (
                <p style={{ marginTop: "1rem" }}>No hay registros en el historial para esta entrevista.</p>
            ) : (
                <div style={{ overflowX: "auto", marginTop: "1.5rem" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr>
                                <th style={{ textAlign: "left", padding: "0.75rem", borderBottom: "1px solid #ddd" }}>Fecha / Hora</th>
                                <th style={{ textAlign: "left", padding: "0.75rem", borderBottom: "1px solid #ddd" }}>Acción</th>
                                <th style={{ textAlign: "left", padding: "0.75rem", borderBottom: "1px solid #ddd" }}>Usuario</th>
                                <th style={{ textAlign: "left", padding: "0.75rem", borderBottom: "1px solid #ddd" }}>Valor anterior</th>
                                <th style={{ textAlign: "left", padding: "0.75rem", borderBottom: "1px solid #ddd" }}>Valor nuevo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historial.map((item) => (
                                <tr key={item.id}>
                                    <td style={{ padding: "0.75rem", verticalAlign: "top", borderBottom: "1px solid #f1f1f1" }}>{item.fechaHora}</td>
                                    <td style={{ padding: "0.75rem", verticalAlign: "top", borderBottom: "1px solid #f1f1f1" }}>{item.accion}</td>
                                    <td style={{ padding: "0.75rem", verticalAlign: "top", borderBottom: "1px solid #f1f1f1" }}>{item.Usuario?.nombre ?? item.usuarioId}</td>
                                    <td style={{ padding: "0.75rem", verticalAlign: "top", borderBottom: "1px solid #f1f1f1", fontFamily: "monospace", fontSize: "0.9rem" }}>{renderValor(item.valorAnterior)}</td>
                                    <td style={{ padding: "0.75rem", verticalAlign: "top", borderBottom: "1px solid #f1f1f1", fontFamily: "monospace", fontSize: "0.9rem" }}>{renderValor(item.valorNuevo)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
