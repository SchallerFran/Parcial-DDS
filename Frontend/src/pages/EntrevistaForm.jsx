import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function EntrevistaForm() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { usuario, puedeGestionar } = useAuth()
    const esEdicion = !!id

    const [form, setForm] = useState({
        postulanteId: "",
        entrevistadorId: "",
        fecha: "",
        horaInicio: "",
        horaFin: "",
        modalidad: "presencial",
        ubicacion: "",
        link: "",
        observaciones: "",
    })

    const [errores, setErrores] = useState({})

    // Datos simulados
    const postulantes = [
        { id: 1, nombre: "Juan Martínez", estado: "nuevo" },
        { id: 2, nombre: "María López", estado: "en_proceso" },
        { id: 3, nombre: "Carlos García", estado: "nuevo" },
    ]

    const entrevistadores = [
        { id: 1, nombre: "Sofía Luna" },
        { id: 2, nombre: "Pedro Ruiz" },
    ]

    useEffect(() => {
        if (esEdicion) {
            // Simulación: cargar datos del formulario
            const entrevista = {
                postulanteId: "1",
                entrevistadorId: "1",
                fecha: "2026-06-18",
                horaInicio: "14:00",
                horaFin: "14:45",
                modalidad: "presencial",
                ubicacion: "Sala 2",
                link: "",
                observaciones: "",
            }
            setForm(entrevista)
        }
    }, [id, esEdicion])

    const validar = () => {
        const newErrores = {}

        if (!form.postulanteId) newErrores.postulanteId = "Debe seleccionar un postulante"
        if (!form.entrevistadorId) newErrores.entrevistadorId = "Debe seleccionar un entrevistador"
        if (!form.fecha) newErrores.fecha = "La fecha es requerida"
        if (!form.horaInicio) newErrores.horaInicio = "La hora de inicio es requerida"
        if (!form.horaFin) newErrores.horaFin = "La hora de fin es requerida"

        if (form.horaInicio >= form.horaFin) {
            newErrores.horario = "La hora de inicio debe ser menor que la hora de fin"
        }

        if (form.modalidad === "presencial" && !form.ubicacion) {
            newErrores.ubicacion = "La ubicación es requerida para modalidad presencial"
        }
        if (form.modalidad === "virtual" && !form.link) {
            newErrores.link = "El link es requerido para modalidad virtual"
        }

        setErrores(newErrores)
        return Object.keys(newErrores).length === 0
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm({ ...form, [name]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validar()) {
            return
        }

        try {
            // Aquí irá la llamada a la API
            console.log("Formulario enviado:", form)
            navigate("/entrevistas")
        } catch (err) {
            console.error("Error:", err)
        }
    }

    if (!puedeGestionar) {
        return <div style={{ padding: "2rem" }}>No tienes permiso para acceder a esta página</div>
    }

    return (
        <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
            <Link to="/entrevistas" style={{ color: "#007bff", textDecoration: "none", marginBottom: "1rem", display: "block" }}>
                ← Volver
            </Link>

            <h1>{esEdicion ? "Editar Entrevista" : "Nueva Entrevista"}</h1>

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="postulanteId">Postulante: *</label>
                    <select
                        id="postulanteId"
                        name="postulanteId"
                        value={form.postulanteId}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
                    >
                        <option value="">Seleccionar postulante...</option>
                        {postulantes.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.nombre} ({p.estado})
                            </option>
                        ))}
                    </select>
                    {errores.postulanteId && <p style={{ color: "red", fontSize: "0.9rem" }}>{errores.postulanteId}</p>}
                </div>

                <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="entrevistadorId">Entrevistador: *</label>
                    <select
                        id="entrevistadorId"
                        name="entrevistadorId"
                        value={form.entrevistadorId}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
                    >
                        <option value="">Seleccionar entrevistador...</option>
                        {entrevistadores.map((e) => (
                            <option key={e.id} value={e.id}>
                                {e.nombre}
                            </option>
                        ))}
                    </select>
                    {errores.entrevistadorId && <p style={{ color: "red", fontSize: "0.9rem" }}>{errores.entrevistadorId}</p>}
                </div>

                <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="fecha">Fecha: *</label>
                    <input
                        id="fecha"
                        name="fecha"
                        type="date"
                        value={form.fecha}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
                    />
                    {errores.fecha && <p style={{ color: "red", fontSize: "0.9rem" }}>{errores.fecha}</p>}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                        <label htmlFor="horaInicio">Hora Inicio: *</label>
                        <input
                            id="horaInicio"
                            name="horaInicio"
                            type="time"
                            value={form.horaInicio}
                            onChange={handleChange}
                            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
                        />
                        {errores.horaInicio && <p style={{ color: "red", fontSize: "0.9rem" }}>{errores.horaInicio}</p>}
                    </div>
                    <div>
                        <label htmlFor="horaFin">Hora Fin: *</label>
                        <input
                            id="horaFin"
                            name="horaFin"
                            type="time"
                            value={form.horaFin}
                            onChange={handleChange}
                            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
                        />
                        {errores.horaFin && <p style={{ color: "red", fontSize: "0.9rem" }}>{errores.horaFin}</p>}
                    </div>
                </div>

                {errores.horario && <p style={{ color: "red", marginBottom: "1rem" }}>{errores.horario}</p>}

                <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="modalidad">Modalidad: *</label>
                    <select
                        id="modalidad"
                        name="modalidad"
                        value={form.modalidad}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
                    >
                        <option value="presencial">Presencial</option>
                        <option value="virtual">Virtual</option>
                    </select>
                </div>

                {form.modalidad === "presencial" && (
                    <div style={{ marginBottom: "1rem" }}>
                        <label htmlFor="ubicacion">Ubicación: *</label>
                        <input
                            id="ubicacion"
                            name="ubicacion"
                            type="text"
                            value={form.ubicacion}
                            onChange={handleChange}
                            placeholder="Ej: Sala 2"
                            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
                        />
                        {errores.ubicacion && <p style={{ color: "red", fontSize: "0.9rem" }}>{errores.ubicacion}</p>}
                    </div>
                )}

                {form.modalidad === "virtual" && (
                    <div style={{ marginBottom: "1rem" }}>
                        <label htmlFor="link">Link de Meet: *</label>
                        <input
                            id="link"
                            name="link"
                            type="url"
                            value={form.link}
                            onChange={handleChange}
                            placeholder="https://meet.google.com/..."
                            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
                        />
                        {errores.link && <p style={{ color: "red", fontSize: "0.9rem" }}>{errores.link}</p>}
                    </div>
                )}

                <div style={{ marginBottom: "1rem" }}>
                    <label htmlFor="observaciones">Observaciones:</label>
                    <textarea
                        id="observaciones"
                        name="observaciones"
                        value={form.observaciones}
                        onChange={handleChange}
                        rows="3"
                        style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
                    />
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                    <button
                        type="submit"
                        style={{
                            flex: 1,
                            padding: "0.75rem",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        {esEdicion ? "Guardar cambios" : "Crear entrevista"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/entrevistas")}
                        style={{
                            flex: 1,
                            padding: "0.75rem",
                            backgroundColor: "#6c757d",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    )
}
