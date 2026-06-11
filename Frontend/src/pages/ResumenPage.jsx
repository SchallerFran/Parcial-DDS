import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { Link } from "react-router-dom"
import entrevistasService from "../services/entrevistas.service"

export default function ResumenPage() {
    const { usuario } = useAuth()
    const [resumen, setResumen] = useState(null)
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const cargar = async () => {
            setCargando(true)
            setError(null)
            try {
                const data = await entrevistasService.obtenerResumen()
                setResumen(data)
            } catch (err) {
                setError("No se pudo cargar el resumen")
            } finally {
                setCargando(false)
            }
        }
        cargar()
    }, [])

    if (cargando) {
        return <div style={{ padding: "2rem" }}>Cargando resumen...</div>
    }

    if (error) {
        return (
            <div style={{ padding: "2rem" }}>
                <p style={{ color: "red" }}>{error}</p>
                <Link to="/entrevistas" style={{ color: "#007bff" }}>← Volver a entrevistas</Link>
            </div>
        )
    }

    if (!resumen) {
        return <div style={{ padding: "2rem" }}>No hay datos disponibles</div>
    }

    const topEntrevistador = resumen.porEntrevistador?.length
        ? resumen.porEntrevistador.reduce((a, b) => (a.total > b.total ? a : b))
        : null

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Panel de Resumen</h1>
            <p style={{ color: "#666" }}>Acceso: Solo Admin/RRHH</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginTop: "2rem" }}>
                <div style={{ padding: "1.5rem", backgroundColor: "#e7f3ff", borderRadius: "4px", borderLeft: "4px solid #007bff" }}>
                    <h3>Entrevistas Hoy</h3>
                    <p style={{ fontSize: "2rem", fontWeight: "bold", margin: "0.5rem 0 0 0" }}>{resumen.entrevistasDelDia ?? 0}</p>
                </div>

                <div style={{ padding: "1.5rem", backgroundColor: "#fff3cd", borderRadius: "4px", borderLeft: "4px solid #ffc107" }}>
                    <h3>Postulantes en Proceso</h3>
                    <p style={{ fontSize: "2rem", fontWeight: "bold", margin: "0.5rem 0 0 0" }}>{resumen.postulantesEnProceso ?? 0}</p>
                </div>

                <div style={{ padding: "1.5rem", backgroundColor: "#d4edda", borderRadius: "4px", borderLeft: "4px solid #28a745" }}>
                    <h3>Entrevistas Realizadas</h3>
                    <p style={{ fontSize: "2rem", fontWeight: "bold", margin: "0.5rem 0 0 0" }}>{resumen.entrevistasDelDia ?? 0}</p>
                </div>

                <div style={{ padding: "1.5rem", backgroundColor: "#f8d7da", borderRadius: "4px", borderLeft: "4px solid #dc3545" }}>
                    <h3>Entrevistas Canceladas</h3>
                    <p style={{ fontSize: "2rem", fontWeight: "bold", margin: "0.5rem 0 0 0" }}>{resumen.entrevistasCanceladas ?? 0}</p>
                </div>

                <div style={{ padding: "1.5rem", backgroundColor: "#f0f0f0", borderRadius: "4px", borderLeft: "4px solid #6c757d" }}>
                    <h3>Total Entrevistadores</h3>
                    <p style={{ fontSize: "2rem", fontWeight: "bold", margin: "0.5rem 0 0 0" }}>{resumen.porEntrevistador?.length ?? 0}</p>
                </div>
            </div>

            {topEntrevistador && (
                <div style={{ marginTop: "2rem", padding: "1.5rem", backgroundColor: "#f8f9fa", borderRadius: "4px" }}>
                    <h3>Entrevistador con más entrevistas</h3>
                    <p>
                        <strong>{topEntrevistador.entrevistador?.nombre ?? `ID ${topEntrevistador.entrevistadorId}`}</strong>: {topEntrevistador.total} entrevistas
                    </p>
                </div>
            )}

            <Link to="/entrevistas" style={{ marginTop: "2rem", display: "inline-block", color: "#007bff", textDecoration: "none" }}>
                ← Volver a entrevistas
            </Link>
        </div>
    )
}
