import { useParams, useNavigate, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"

export default function EntrevistaDetalle() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { usuario, puedeGestionar } = useAuth()

    // Simulación de datos hasta que el backend esté listo
    const [entrevista, setEntrevista] = useState(null)

    useEffect(() => {
        // Simulación: buscar en datos locales
        const entrevistas = [
            {
                id: 1,
                postulanteId: 1,
                postulante: { id: 1, nombre: "Juan", apellido: "Martínez", email: "juan@mail.com", puesto: "Frontend Junior", estado: "nuevo" },
                entrevistadorId: 1,
                entrevistador: { id: 1, nombre: "Sofía", email: "sofia@test.com" },
                fecha: "2026-06-18",
                horaInicio: "14:00",
                horaFin: "14:45",
                modalidad: "presencial",
                ubicacion: "Sala 2",
                estado: "programada",
                observaciones: "",
            },
            {
                id: 2,
                postulanteId: 2,
                postulante: { id: 2, nombre: "María", apellido: "López", email: "maria@mail.com", puesto: "Backend Junior", estado: "en_proceso" },
                entrevistadorId: 1,
                entrevistador: { id: 1, nombre: "Sofía", email: "sofia@test.com" },
                fecha: "2026-06-19",
                horaInicio: "10:00",
                horaFin: "10:45",
                modalidad: "virtual",
                link: "https://meet.google.com/abc-defg-hij",
                estado: "realizada",
                observaciones: "Buen desempeño técnico",
            },
        ]

        const found = entrevistas.find((e) => e.id === parseInt(id))
        if (found) {
            setEntrevista(found)
        } else {
            // Redirigir a 404
            navigate("/no-encontrado")
        }
    }, [id, navigate])

    if (!entrevista) {
        return <div style={{ padding: "2rem" }}>Cargando...</div>
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
