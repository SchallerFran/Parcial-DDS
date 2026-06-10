import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useAsync } from "../hooks/useAsync"
import api from "../config/axios"

export default function EntrevistasPage() {
    const { usuario, puedeGestionar } = useAuth()
    const [filtros, setFiltros] = useState({
        fecha: "",
        estado: "",
        entrevistadorId: "",
        postulanteId: "",
    })

    // Simulación de datos hasta que el backend esté listo
    const [entrevistas, setEntrevistas] = useState([
        {
            id: 1,
            postulanteId: 1,
            postulante: { nombre: "Juan", apellido: "Martínez" },
            entrevistadorId: 1,
            entrevistador: { nombre: "Sofía" },
            fecha: "2026-06-18",
            horaInicio: "14:00",
            horaFin: "14:45",
            modalidad: "presencial",
            estado: "programada",
            observaciones: "",
        },
        {
            id: 2,
            postulanteId: 2,
            postulante: { nombre: "María", apellido: "López" },
            entrevistadorId: 1,
            entrevistador: { nombre: "Sofía" },
            fecha: "2026-06-19",
            horaInicio: "10:00",
            horaFin: "10:45",
            modalidad: "virtual",
            estado: "realizada",
            observaciones: "Buen desempeño técnico",
        },
    ])

    const handleFiltro = (e) => {
        const { name, value } = e.target
        setFiltros({ ...filtros, [name]: value })
    }


    return (
        <div style={{ padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h1>Entrevistas</h1>
                {puedeGestionar && (
                    <Link
                        to="/entrevistas/crear"
                        style={{
                            padding: "0.75rem 1.5rem",
                            backgroundColor: "#007bff",
                            color: "white",
                            textDecoration: "none",
                            borderRadius: "4px",
                        }}
                    >
                        + Nueva Entrevista
                    </Link>
                )}
            </div>

            {/* Filtros */}
            <div style={{ marginBottom: "2rem", padding: "1rem", backgroundColor: "#f8f9fa", borderRadius: "4px" }}>
                <h3>Filtros</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "1rem" }}>
                    <input
                        type="date"
                        name="fecha"
                        value={filtros.fecha}
                        onChange={handleFiltro}
                        style={{ padding: "0.5rem" }}
                        placeholder="Fecha"
                    />
                    <select
                        name="estado"
                        value={filtros.estado}
                        onChange={handleFiltro}
                        style={{ padding: "0.5rem" }}
                    >
                        <option value="">Todos los estados</option>
                        <option value="programada">Programada</option>
                        <option value="realizada">Realizada</option>
                        <option value="cancelada">Cancelada</option>
                        <option value="reprogramada">Reprogramada</option>
                    </select>
                    <input
                        type="text"
                        name="entrevistadorId"
                        value={filtros.entrevistadorId}
                        onChange={handleFiltro}
                        style={{ padding: "0.5rem" }}
                        placeholder="ID Entrevistador"
                    />
                    <button
                        onClick={() => setFiltros({ fecha: "", estado: "", entrevistadorId: "", postulanteId: "" })}
                        style={{
                            padding: "0.5rem",
                            backgroundColor: "#6c757d",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        Limpiar Filtros
                    </button>
                </div>
            </div>

            {/* Listado */}
            {entrevistas.length === 0 ? (
                <p>No hay entrevistas que coincidan con los filtros.</p>
            ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ backgroundColor: "#f8f9fa", borderBottom: "2px solid #dee2e6" }}>
                            <th style={{ padding: "1rem", textAlign: "left" }}>Postulante</th>
                            <th style={{ padding: "1rem", textAlign: "left" }}>Entrevistador</th>
                            <th style={{ padding: "1rem", textAlign: "left" }}>Fecha</th>
                            <th style={{ padding: "1rem", textAlign: "left" }}>Horario</th>
                            <th style={{ padding: "1rem", textAlign: "left" }}>Modalidad</th>
                            <th style={{ padding: "1rem", textAlign: "left" }}>Estado</th>
                            <th style={{ padding: "1rem", textAlign: "left" }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entrevistas.map((ent) => (
                            <tr key={ent.id} style={{ borderBottom: "1px solid #dee2e6" }}>
                                <td style={{ padding: "1rem" }}>
                                    {ent.postulante.nombre} {ent.postulante.apellido}
                                </td>
                                <td style={{ padding: "1rem" }}>{ent.entrevistador.nombre}</td>
                                <td style={{ padding: "1rem" }}>{ent.fecha}</td>
                                <td style={{ padding: "1rem" }}>
                                    {ent.horaInicio} - {ent.horaFin}
                                </td>
                                <td style={{ padding: "1rem" }}>
                                    <span
                                        style={{
                                            padding: "0.25rem 0.75rem",
                                            backgroundColor: ent.modalidad === "virtual" ? "#e7f3ff" : "#ffe7e7",
                                            borderRadius: "4px",
                                            fontSize: "0.9rem",
                                        }}
                                    >
                                        {ent.modalidad}
                                    </span>
                                </td>
                                <td style={{ padding: "1rem" }}>
                                    <span
                                        style={{
                                            padding: "0.25rem 0.75rem",
                                            backgroundColor:
                                                ent.estado === "realizada"
                                                    ? "#d4edda"
                                                    : ent.estado === "cancelada"
                                                      ? "#f8d7da"
                                                      : "#cfe2ff",
                                            borderRadius: "4px",
                                            fontSize: "0.9rem",
                                        }}
                                    >
                                        {ent.estado}
                                    </span>
                                </td>
                                <td style={{ padding: "1rem" }}>
                                    <Link
                                        to={`/entrevistas/${ent.id}`}
                                        style={{
                                            marginRight: "0.5rem",
                                            color: "#007bff",
                                            textDecoration: "none",
                                        }}
                                    >
                                        Ver
                                    </Link>
                                    {puedeGestionar && (
                                        <Link
                                            to={`/entrevistas/${ent.id}/editar`}
                                            style={{ color: "#ffc107", textDecoration: "none" }}
                                        >
                                            Editar
                                        </Link>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}
