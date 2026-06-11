import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import entrevistasService from "../services/entrevistas.service"
import postulantesService from "../services/postulantes.service"
import usuariosService from "../services/usuarios.service"

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
    const [postulantes, setPostulantes] = useState([])
    const [entrevistadores, setEntrevistadores] = useState([])
    const [cargandoDatos, setCargandoDatos] = useState(true)
    const [guardando, setGuardando] = useState(false)
    const [errorCarga, setErrorCarga] = useState(null)

    useEffect(() => {
        const cargarDatos = async () => {
            setCargandoDatos(true)
            setErrorCarga(null)
            try {
                const [resPostulantes, resEntrevistadores] = await Promise.all([
                    postulantesService.listar(),
                    usuariosService.listarEntrevistadores()
                ])
                setPostulantes(resPostulantes.data ?? resPostulantes)
                setEntrevistadores(resEntrevistadores)
            } catch (err) {
                setErrorCarga("Error al cargar datos del formulario")
            } finally {
                setCargandoDatos(false)
            }
        }
        cargarDatos()
    }, [])

    useEffect(() => {
        if (esEdicion) {
            const cargarEntrevista = async () => {
                try {
                    const data = await entrevistasService.obtener(id)
                    setForm({
                        postulanteId: String(data.postulanteId ?? ""),
                        entrevistadorId: String(data.entrevistadorId ?? ""),
                        fecha: data.fecha ?? "",
                        horaInicio: data.horaInicio ?? "",
                        horaFin: data.horaFin ?? "",
                        modalidad: data.modalidad ?? "presencial",
                        ubicacion: data.ubicacion ?? "",
                        link: data.link ?? "",
                        observaciones: data.observaciones ?? "",
                    })
                } catch (err) {
                    setErrorCarga("Error al cargar la entrevista")
                }
            }
            cargarEntrevista()
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
        if (!validar()) return

        setGuardando(true)
        try {
            const payload = {
                ...form,
                postulanteId: Number(form.postulanteId),
                entrevistadorId: Number(form.entrevistadorId),
            }
            if (esEdicion) {
                await entrevistasService.editar(id, payload)
            } else {
                await entrevistasService.crear(payload)
            }
            navigate("/entrevistas")
        } catch (err) {
            setErrores({ general: err.response?.data?.error || "Error al guardar la entrevista" })
        } finally {
            setGuardando(false)
        }
    }

    // --- Controles de acceso y carga ---
    if (!puedeGestionar) {
        return <div className="page" style={{ textAlign: "center" }}><h3>No tenés permiso para acceder a esta página</h3></div>
    }

    if (cargandoDatos) {
        return <div className="page" style={{ textAlign: "center", color: "var(--gris-texto)" }}>Cargando formulario...</div>
    }

    if (errorCarga) {
        return (
            <div className="page" style={{ maxWidth: "700px" }}>
                <div className="error-msg">{errorCarga}</div>
                <Link to="/entrevistas" style={{ fontWeight: 600 }}>← Volver</Link>
            </div>
        )
    }

    // --- Renderizado principal ---
    return (
        /* Usamos la clase page para centrar y le damos un ancho máximo moderado */
        <div className="page" style={{ maxWidth: "750px" }}>
            
            <Link to="/entrevistas" style={{ display: "inline-block", marginBottom: "1.5rem", fontWeight: "500" }}>
                ← Volver a Entrevistas
            </Link>

            {/* Envolvemos todo el formulario en la tarjeta blanca con sombra */}
            <div className="card">
                <h1 style={{ color: "var(--morado-oscuro)", marginBottom: "2rem", borderBottom: "2px solid var(--gris-borde)", paddingBottom: "0.5rem" }}>
                    {esEdicion ? "Editar Entrevista" : "Nueva Entrevista"}
                </h1>

                <form onSubmit={handleSubmit}>
                    
                    {/* General Errors */}
                    {errores.general && <div className="error-msg">{errores.general}</div>}
                    {errores.horario && <div className="error-msg">{errores.horario}</div>}

                    <div style={{ marginBottom: "1.2rem" }}>
                        <label htmlFor="postulanteId">Postulante: *</label>
                        <select id="postulanteId" name="postulanteId" value={form.postulanteId} onChange={handleChange}>
                            <option value="">Seleccionar postulante...</option>
                            {postulantes.map((p) => (
                                <option key={p.id} value={p.id}>{p.nombre} ({p.estado})</option>
                            ))}
                        </select>
                        {errores.postulanteId && <span style={{ color: "#991B1B", fontSize: "0.85rem" }}>{errores.postulanteId}</span>}
                    </div>

                    <div style={{ marginBottom: "1.2rem" }}>
                        <label htmlFor="entrevistadorId">Entrevistador: *</label>
                        <select id="entrevistadorId" name="entrevistadorId" value={form.entrevistadorId} onChange={handleChange}>
                            <option value="">Seleccionar entrevistador...</option>
                            {entrevistadores.map((e) => (
                                <option key={e.id} value={e.id}>{e.nombre}</option>
                            ))}
                        </select>
                        {errores.entrevistadorId && <span style={{ color: "#991B1B", fontSize: "0.85rem" }}>{errores.entrevistadorId}</span>}
                    </div>

                    <div style={{ marginBottom: "1.2rem" }}>
                        <label htmlFor="fecha">Fecha: *</label>
                        <input id="fecha" name="fecha" type="date" value={form.fecha} onChange={handleChange} />
                        {errores.fecha && <span style={{ color: "#991B1B", fontSize: "0.85rem" }}>{errores.fecha}</span>}
                    </div>

                    {/* Grilla para las horas */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.2rem" }}>
                        <div>
                            <label htmlFor="horaInicio">Hora Inicio: *</label>
                            <input id="horaInicio" name="horaInicio" type="time" value={form.horaInicio} onChange={handleChange} />
                            {errores.horaInicio && <span style={{ color: "#991B1B", fontSize: "0.85rem" }}>{errores.horaInicio}</span>}
                        </div>
                        <div>
                            <label htmlFor="horaFin">Hora Fin: *</label>
                            <input id="horaFin" name="horaFin" type="time" value={form.horaFin} onChange={handleChange} />
                            {errores.horaFin && <span style={{ color: "#991B1B", fontSize: "0.85rem" }}>{errores.horaFin}</span>}
                        </div>
                    </div>

                    <div style={{ marginBottom: "1.2rem" }}>
                        <label htmlFor="modalidad">Modalidad: *</label>
                        <select id="modalidad" name="modalidad" value={form.modalidad} onChange={handleChange}>
                            <option value="presencial">Presencial</option>
                            <option value="virtual">Virtual</option>
                        </select>
                    </div>

                    {form.modalidad === "presencial" && (
                        <div style={{ marginBottom: "1.2rem" }}>
                            <label htmlFor="ubicacion">Ubicación: *</label>
                            <input id="ubicacion" name="ubicacion" type="text" value={form.ubicacion} onChange={handleChange} placeholder="Ej: Sala 2" />
                            {errores.ubicacion && <span style={{ color: "#991B1B", fontSize: "0.85rem" }}>{errores.ubicacion}</span>}
                        </div>
                    )}

                    {form.modalidad === "virtual" && (
                        <div style={{ marginBottom: "1.2rem" }}>
                            <label htmlFor="link">Link de Meet: *</label>
                            <input id="link" name="link" type="url" value={form.link} onChange={handleChange} placeholder="https://meet.google.com/..." />
                            {errores.link && <span style={{ color: "#991B1B", fontSize: "0.85rem" }}>{errores.link}</span>}
                        </div>
                    )}

                    <div style={{ marginBottom: "2rem" }}>
                        <label htmlFor="observaciones">Observaciones:</label>
                        <textarea id="observaciones" name="observaciones" value={form.observaciones} onChange={handleChange} rows="3" />
                    </div>

                    {/* Contenedor de botones */}
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <button
                            type="submit"
                            disabled={guardando}
                            className="btn-glow" 
                            style={{ flex: 1, opacity: guardando ? 0.7 : 1 }}
                        >
                            {guardando ? "Guardando..." : esEdicion ? "Guardar cambios" : "Crear entrevista"}
                        </button>
                        
                        <button
                            type="button"
                            onClick={() => navigate("/entrevistas")}
                            className="btn-secundario" 
                            style={{ flex: 1 }}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}