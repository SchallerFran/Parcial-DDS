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

    if (cargando) return <div className="page" style={{ textAlign: "center", padding: "4rem" }}>Cargando dashboard...</div>

    if (error) {
        return (
            <div className="page">
                <div className="error-msg">{error}</div>
                <Link to="/entrevistas">← Volver a entrevistas</Link>
            </div>
        )
    }

    if (!resumen) return <div className="page">No hay datos disponibles</div>

    // Componente interno para las tarjetas de estadísticas
    const StatCard = ({ title, value, colorClass }) => (
        <div className="card" style={{ borderLeft: `6px solid var(${colorClass})` }}>
            <h3 style={{ fontSize: "0.85rem", color: "var(--gris-texto)", marginBottom: "0.5rem", textTransform: "uppercase" }}>{title}</h3>
            <p style={{ fontSize: "2.5rem", fontWeight: "700", color: "var(--morado-oscuro)" }}>{value}</p>
        </div>
    )

    return (
        <div className="page">
            <h1 style={{ marginBottom: "2rem" }}>Panel de Resumen</h1>
            <div style={{ 
                display: "flex", 
                gap: "1rem", 
                justifyContent: "flex-start", 
                flexWrap: "nowrap", /* Evita que salten a la siguiente línea */
                overflowX: "auto"   /* Por si en pantallas chicas el contenido desborda, scroll lateral */
            }}>
                <div style={{ flex: "1" }}><StatCard title="Entrevistas Hoy" value={resumen.entrevistasDelDia ?? 0} colorClass="--rosa" /></div>
                <div style={{ flex: "1" }}><StatCard title="En Proceso" value={resumen.postulantesEnProceso ?? 0} colorClass="--magenta" /></div>
                <div style={{ flex: "1" }}><StatCard title="Realizadas" value={resumen.entrevistasRealizadas ?? 0} colorClass="--verde-exito" /></div>
                <div style={{ flex: "1" }}><StatCard title="Canceladas" value={resumen.entrevistasCanceladas ?? 0} colorClass="--rojo-error" /></div>
                <div style={{ flex: "1" }}><StatCard title="Entrevistadores" value={resumen.porEntrevistador?.length ?? 0} colorClass="--morado" /></div>
            </div>

            <div style={{ marginTop: "2rem" }}>
                {/* Lo dejamos como un link simple, sin la clase de botón */}
                <Link to="/entrevistas" style={{ 
                    color: "var(--morado-oscuro)", 
                    fontWeight: "600", 
                    textDecoration: "underline",
                    cursor: "pointer"
                }}>
                    ← Volver a entrevistas
                </Link>
            </div>
        </div>
    )
}   