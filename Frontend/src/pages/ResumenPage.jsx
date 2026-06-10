import { useAuth } from "../context/AuthContext"
import { Link } from "react-router-dom"

export default function ResumenPage() {
    const { usuario } = useAuth()

    // Datos simulados para el resumen
    const resumen = {
        entrevistasHoy: 3,
        entrevistasProximos7Dias: 8,
        postulantesEnProceso: 12,
        entrevistasReprogramadas: 2,
        entrevistasRealizadas: 45,
        entrevistascanceladas: 5,
        entrevistadorConMasEntrevistas: { nombre: "Sofía Luna", cantidad: 12 },
    }

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Panel de Resumen</h1>
            <p style={{ color: "#666" }}>Acceso: Solo Admin/RRHH</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginTop: "2rem" }}>
                <div style={{ padding: "1.5rem", backgroundColor: "#e7f3ff", borderRadius: "4px", borderLeft: "4px solid #007bff" }}>
                    <h3>Entrevistas Hoy</h3>
                    <p style={{ fontSize: "2rem", fontWeight: "bold", margin: "0.5rem 0 0 0" }}>{resumen.entrevistasHoy}</p>
                </div>

                <div style={{ padding: "1.5rem", backgroundColor: "#e7f7ff", borderRadius: "4px", borderLeft: "4px solid #17a2b8" }}>
                    <h3>Próximos 7 Días</h3>
                    <p style={{ fontSize: "2rem", fontWeight: "bold", margin: "0.5rem 0 0 0" }}>{resumen.entrevistasProximos7Dias}</p>
                </div>

                <div style={{ padding: "1.5rem", backgroundColor: "#fff3cd", borderRadius: "4px", borderLeft: "4px solid #ffc107" }}>
                    <h3>Postulantes en Proceso</h3>
                    <p style={{ fontSize: "2rem", fontWeight: "bold", margin: "0.5rem 0 0 0" }}>{resumen.postulantesEnProceso}</p>
                </div>

                <div style={{ padding: "1.5rem", backgroundColor: "#d4edda", borderRadius: "4px", borderLeft: "4px solid #28a745" }}>
                    <h3>Entrevistas Realizadas</h3>
                    <p style={{ fontSize: "2rem", fontWeight: "bold", margin: "0.5rem 0 0 0" }}>{resumen.entrevistasRealizadas}</p>
                </div>

                <div style={{ padding: "1.5rem", backgroundColor: "#f8d7da", borderRadius: "4px", borderLeft: "4px solid #dc3545" }}>
                    <h3>Entrevistas Canceladas</h3>
                    <p style={{ fontSize: "2rem", fontWeight: "bold", margin: "0.5rem 0 0 0" }}>{resumen.entrevistascanceladas}</p>
                </div>

                <div style={{ padding: "1.5rem", backgroundColor: "#f0f0f0", borderRadius: "4px", borderLeft: "4px solid #6c757d" }}>
                    <h3>Entrevistas Reprogramadas</h3>
                    <p style={{ fontSize: "2rem", fontWeight: "bold", margin: "0.5rem 0 0 0" }}>{resumen.entrevistasReprogramadas}</p>
                </div>
            </div>

            <div style={{ marginTop: "2rem", padding: "1.5rem", backgroundColor: "#f8f9fa", borderRadius: "4px" }}>
                <h3>Entrevistador con más entrevistas</h3>
                <p>
                    <strong>{resumen.entrevistadorConMasEntrevistas.nombre}</strong>: {resumen.entrevistadorConMasEntrevistas.cantidad} entrevistas
                </p>
            </div>

            <Link to="/entrevistas" style={{ marginTop: "2rem", display: "inline-block", color: "#007bff", textDecoration: "none" }}>
                ← Volver a entrevistas
            </Link>
        </div>
    )
}
