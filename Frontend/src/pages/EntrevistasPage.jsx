import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import entrevistasService from "../services/entrevistas.service"
import usuariosService from "../services/usuarios.service"
import postulantesService from "../services/postulantes.service"

export default function EntrevistasPage() {
    const { puedeGestionar } = useAuth()
    const navigate = useNavigate()

    const [entrevistas, setEntrevistas] = useState([])
    const [total, setTotal] = useState(0)
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState(null)

    const [filtros, setFiltros] = useState({
        fecha: "", estado: "", entrevistadorId: "", postulanteId: "",
        page: 1, limit: 10, sortBy: "fecha", order: "ASC"
    })

    const [listaEntrevistadores, setListaEntrevistadores] = useState([])
    const [listaPostulantes, setListaPostulantes] = useState([])

    useEffect(() => {
        const cargarDatos = async () => {
            cargar()
            try {
                const [evs, posts] = await Promise.all([
                    usuariosService.listarEntrevistadores(),
                    postulantesService.listar()
                ])
                setListaEntrevistadores(evs)
                setListaPostulantes(posts.data ?? posts)
            } catch (e) {
                // no bloquear si fallan
            }
        }
        cargarDatos()
    }, [filtros])

    const cargar = async () => {
        setCargando(true)
        setError(null)
        try {
        const params = Object.fromEntries(
            Object.entries(filtros).filter(([, v]) => v !== "")
        )
        const data = await entrevistasService.listar(params)
        setEntrevistas(data.data ?? data)
        setTotal(data.total ?? 0)
        } catch (err) {
        setError(err.mensaje || "No se pudieron cargar las entrevistas")
        } finally {
        setCargando(false)
        }
    }

    const handleFiltro = (e) => {
        setFiltros(prev => ({ ...prev, [e.target.name]: e.target.value, page: 1 }))
    }

    const limpiarFiltros = () => {
        setFiltros({
        fecha: "", estado: "", entrevistadorId: "", postulanteId: "",
        page: 1, limit: 10, sortBy: "fecha", order: "ASC"
        })
    }

    const totalPaginas = Math.ceil(total / filtros.limit)

    return (
        <div className="page">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <h1>Entrevistas</h1>
            {puedeGestionar && (
            <button
                onClick={() => navigate("/entrevistas/nueva")}
                className="btn-glow"
                style={{ width: "auto", padding: "0.75rem 1.5rem" }} // Anulamos el width: 100% de la clase para este botón
            >
                + Nueva Entrevista
            </button>
            )}
        </div>

        {/* Filtros envueltos en una Card */}
        <div className="card" style={{ marginBottom: "1.5rem", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
            <input type="date" name="fecha" value={filtros.fecha} onChange={handleFiltro} style={{ width: "auto" }} />
            
            <select name="estado" value={filtros.estado} onChange={handleFiltro} style={{ width: "auto" }}>
            <option value="">Todos los estados</option>
            <option value="programada">Programada</option>
            <option value="reprogramada">Reprogramada</option>
            <option value="realizada">Realizada</option>
            <option value="cancelada">Cancelada</option>
            </select>
            
            <select name="entrevistadorId" value={filtros.entrevistadorId} onChange={handleFiltro} style={{ width: "auto" }}>
                <option value="">Entrevistador (todos)</option>
                {listaEntrevistadores.map(u => (
                <option key={u.id} value={u.id}>{u.nombre} {u.apellido ?? ''}</option>
                ))}
            </select>

            <select name="postulanteId" value={filtros.postulanteId} onChange={handleFiltro} style={{ width: "auto" }}>
                <option value="">Postulante (todos)</option>
                {listaPostulantes.map(p => (
                <option key={p.id} value={p.id}>{p.nombre} {p.apellido ?? ''}</option>
                ))}
            </select>
            
            <button 
            onClick={limpiarFiltros} 
            style={{ 
                padding: "0.85rem 1rem", 
                backgroundColor: "var(--gris-borde)", 
                color: "var(--texto)", 
                border: "none", 
                borderRadius: "var(--radio)", 
                cursor: "pointer", 
                fontWeight: "600" 
            }}
            >
            Limpiar filtros
            </button>
        </div>

        {/* Estados de Carga y Error */}
        {cargando && <p style={{ textAlign: "center", padding: "3rem", color: "var(--gris-texto)" }}>Cargando entrevistas...</p>}

        {error && !cargando && (
            <div className="error-msg">
            {error} 
            <button onClick={cargar} style={{ marginLeft: "1rem", background: "none", border: "none", color: "#991B1B", cursor: "pointer", textDecoration: "underline" }}>
                Reintentar
            </button>
            </div>
        )}

        {!cargando && !error && entrevistas.length === 0 && (
            <p style={{ textAlign: "center", padding: "3rem", color: "var(--gris-texto)" }}>No hay entrevistas que coincidan con los filtros.</p>
        )}

        {/* Tabla limpia (Toma los estilos automáticamente del index.css) */}
        {!cargando && !error && entrevistas.length > 0 && (
            <>
            <table>
                <thead>
                <tr>
                    {["Postulante", "Entrevistador", "Fecha", "Horario", "Modalidad", "Estado", "Acciones"].map(col => (
                    <th key={col} style={{ padding: "1rem" }}>{col}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {entrevistas.map(ent => (
                    <tr key={ent.id}>
                    <td style={{ padding: "1rem" }}>{ent.postulante ? `${ent.postulante.nombre} ${ent.postulante.apellido}` : ent.postulanteId}</td>
                    <td style={{ padding: "1rem" }}>{ent.entrevistador?.nombre ?? ent.entrevistadorId}</td>
                    <td style={{ padding: "1rem" }}>{ent.fecha}</td>
                    <td style={{ padding: "1rem" }}>{ent.horaInicio} - {ent.horaFin}</td>
                    <td style={{ padding: "1rem" }}>{ent.modalidad}</td>
                    <td style={{ padding: "1rem" }}>
                        {/* Magia pura: Inyectamos la variable del estado directo a la clase CSS */}
                        <span className={`badge-${ent.estado}`}>
                        {ent.estado.charAt(0).toUpperCase() + ent.estado.slice(1)}
                        </span>
                    </td>
                    <td style={{ padding: "1rem" }}>
                        <Link to={`/entrevistas/${ent.id}`} style={{ fontWeight: 600 }}>Ver detalle</Link>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Paginación */}
            {totalPaginas > 1 && (
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", justifyContent: "center", marginTop: "2rem", fontSize: "0.9rem", color: "var(--gris-texto)" }}>
                <button 
                    disabled={filtros.page === 1} 
                    onClick={() => setFiltros(p => ({ ...p, page: p.page - 1 }))}
                    style={{ padding: "0.5rem 1rem", border: "1px solid var(--gris-borde)", borderRadius: "var(--radio)", cursor: "pointer", background: "var(--blanco)" }}
                >
                    ← Anterior
                </button>
                
                <span style={{ fontWeight: 500 }}>Página {filtros.page} de {totalPaginas}</span>
                
                <button 
                    disabled={filtros.page === totalPaginas} 
                    onClick={() => setFiltros(p => ({ ...p, page: p.page + 1 }))}
                    style={{ padding: "0.5rem 1rem", border: "1px solid var(--gris-borde)", borderRadius: "var(--radio)", cursor: "pointer", background: "var(--blanco)" }}
                >
                    Siguiente →
                </button>
                </div>
            )}
            </>
        )}
        </div>
    )
}