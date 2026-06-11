import { useParams, useNavigate, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import entrevistasService from "../services/entrevistas.service"

export default function EntrevistaDetalle() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { usuario, puedeGestionar } = useAuth()
    const [entrevista, setEntrevista] = useState(null)
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const cargar = async () => {
            setCargando(true)
            setError(null)
            try {
                const data = await entrevistasService.obtener(id)
                setEntrevista(data)
            } catch (err) {
                setError("No se pudo cargar la entrevista")
            } finally {
                setCargando(false)
            }
        }
        cargar()
    }, [id])

    if (cargando) {
        return <div style={{ padding: "2rem" }}>Cargando...</div>
    }

    if (error) {
        return (
            <div style={{ padding: "2rem" }}>
                <p style={{ color: "red" }}>{error}</p>
                <Link to="/entrevistas" style={{ color: "#007bff" }}>← Volver a listado</Link>
            </div>
        )
    }

    if (!entrevista) {
        return <div style={{ padding: "2rem" }}>Entrevista no encontrada</div>
    }

    return (
        <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
            <Link to="/entrevistas" style={{ color: "#007bff", textDecoration: "none", marginBottom: "1rem", display: "block" }}>
                ← Volver a listado
            </Link>

            <h1>Detalle de Entrevista</h1>

            <div style={{ backgroundColor: "#f8f9fa", padding: "1.5rem", borderRadius: "4px", marginBottom: "2rem" }}>
                <h2>Información General</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                        <strong>Postulante:</strong>
                        <p>
                            {entrevista.postulante.nombre} {entrevista.postulante.apellido}
                        </p>
                    </div>
                    <div>
                        <strong>Email:</strong>
                        <p>{entrevista.postulante.email}</p>
                    </div>
                    <div>
                        <strong>Puesto:</strong>
                        <p>{entrevista.postulante.puesto}</p>
                    </div>
                    <div>
                        <strong>Estado del Postulante:</strong>
                        <p>{entrevista.postulante.estado}</p>
                    </div>
                </div>

                <h3>Detalles de la Entrevista</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                        <strong>Entrevistador:</strong>
                        <p>{entrevista.entrevistador.nombre}</p>
                    </div>
                    <div>
                        <strong>Fecha:</strong>
                        <p>{entrevista.fecha}</p>
                    </div>
                    <div>
                        <strong>Horario:</strong>
                        <p>
                            {entrevista.horaInicio} - {entrevista.horaFin}
                        </p>
                    </div>
                    <div>
                        <strong>Modalidad:</strong>
                        <p>{entrevista.modalidad}</p>
                    </div>
                    <div>
                        <strong>{entrevista.modalidad === "presencial" ? "Ubicación" : "Link"}:</strong>
                        <p>
                            {entrevista.modalidad === "presencial" ? entrevista.ubicacion : (
                                <a href={entrevista.link} target="_blank" rel="noopener noreferrer">
                                    {entrevista.link}
                                </a>
                            )}
                        </p>
                    </div>
                    <div>
                        <strong>Estado:</strong>
                        <p>
                            <span
                                style={{
                                    padding: "0.25rem 0.75rem",
                                    backgroundColor:
                                        entrevista.estado === "realizada"
                                            ? "#d4edda"
                                            : entrevista.estado === "cancelada"
                                                ? "#f8d7da"
                                                : "#cfe2ff",
                                    borderRadius: "4px",
                                }}
                            >
                                {entrevista.estado}
                            </span>
                        </p>
                    </div>
                </div>

                {entrevista.observaciones && (
                    <div>
                        <strong>Observaciones:</strong>
                        <p>{entrevista.observaciones}</p>
                    </div>
                )}
            </div>

            {puedeGestionar && (
                <div style={{ display: "flex", gap: "1rem" }}>
                    <Link
                        to={`/entrevistas/${entrevista.id}/editar`}
                        style={{
                            padding: "0.75rem 1.5rem",
                            backgroundColor: "#ffc107",
                            color: "black",
                            textDecoration: "none",
                            borderRadius: "4px",
                        }}
                    >
                        Editar
                    </Link>
                    <button
                        onClick={() => {
                            if (window.confirm("¿Deseas cancelar esta entrevista?")) {
                                console.log("Entrevista cancelada")
                                navigate("/entrevistas")
                            }
                        }}
                        style={{
                            padding: "0.75rem 1.5rem",
                            backgroundColor: "#dc3545",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        Cancelar
                    </button>
                </div>
            )}
        </div>
    )
}
