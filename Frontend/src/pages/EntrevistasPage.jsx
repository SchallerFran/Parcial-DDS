import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import entrevistasService from "../services/entrevistas.service"

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

  useEffect(() => {
    cargar()
  }, [filtros])

  const cargar = async () => {
    setCargando(true)
    setError(null)
    try {
      // Limpia params vacíos antes de enviar
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
    <div style={{ padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1>Entrevistas</h1>
        {puedeGestionar && (
          <button
            onClick={() => navigate("/entrevistas/nueva")}
            style={{ padding: "0.75rem 1.5rem", backgroundColor: "#810B38", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
          >
            + Nueva Entrevista
          </button>
        )}
      </div>

      {/* Filtros */}
      <div style={{ marginBottom: "1.5rem", padding: "1rem", backgroundColor: "#F1E2D1", borderRadius: "6px", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <input type="date" name="fecha" value={filtros.fecha} onChange={handleFiltro} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #DCC3AA" }} />
        <select name="estado" value={filtros.estado} onChange={handleFiltro} style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #DCC3AA" }}>
          <option value="">Todos los estados</option>
          <option value="programada">Programada</option>
          <option value="reprogramada">Reprogramada</option>
          <option value="realizada">Realizada</option>
          <option value="cancelada">Cancelada</option>
        </select>
        <input type="text" name="entrevistadorId" value={filtros.entrevistadorId} onChange={handleFiltro} placeholder="ID Entrevistador" style={{ padding: "0.5rem", borderRadius: "6px", border: "1px solid #DCC3AA" }} />
        <button onClick={limpiarFiltros} style={{ padding: "0.5rem 1rem", backgroundColor: "#541A1A", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
          Limpiar filtros
        </button>
      </div>

      {/* Estados */}
      {cargando && <p style={{ textAlign: "center", padding: "3rem", color: "#6B5B52" }}>Cargando entrevistas...</p>}

      {error && !cargando && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B", padding: "1rem", borderRadius: "6px", marginBottom: "1rem" }}>
          {error} <button onClick={cargar} style={{ marginLeft: "1rem", background: "none", border: "none", color: "#991B1B", cursor: "pointer", textDecoration: "underline" }}>Reintentar</button>
        </div>
      )}

      {!cargando && !error && entrevistas.length === 0 && (
        <p style={{ textAlign: "center", padding: "3rem", color: "#6B5B52" }}>No hay entrevistas que coincidan con los filtros.</p>
      )}

      {!cargando && !error && entrevistas.length > 0 && (
        <>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "6px", overflow: "hidden", boxShadow: "0 1px 3px rgba(84,26,26,0.08)" }}>
            <thead>
              <tr style={{ backgroundColor: "#F7F3F0", borderBottom: "2px solid #E8DDD5" }}>
                {["Postulante", "Entrevistador", "Fecha", "Horario", "Modalidad", "Estado", "Acciones"].map(col => (
                  <th key={col} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", color: "#6B5B52" }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entrevistas.map(ent => (
                <tr key={ent.id} style={{ borderBottom: "1px solid #E8DDD5" }}>
                  <td style={{ padding: "0.75rem 1rem" }}>{ent.postulante ? `${ent.postulante.nombre} ${ent.postulante.apellido}` : ent.postulanteId}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>{ent.entrevistador?.nombre ?? ent.entrevistadorId}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>{ent.fecha}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>{ent.horaInicio} - {ent.horaFin}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>{ent.modalidad}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <span style={{
                      padding: "0.25rem 0.65rem", borderRadius: "999px", fontSize: "0.78rem", fontWeight: 500,
                      background: ent.estado === "realizada" ? "#E0EDE6" : ent.estado === "cancelada" ? "#EDE0E0" : ent.estado === "reprogramada" ? "#EDE9E0" : "#EDE0F0",
                      color: ent.estado === "realizada" ? "#1F5C38" : ent.estado === "cancelada" ? "#5C1F1F" : ent.estado === "reprogramada" ? "#5C4A1F" : "#5B1F6E"
                    }}>
                      {ent.estado}
                    </span>
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <Link to={`/entrevistas/${ent.id}`} style={{ color: "#810B38", textDecoration: "none", fontWeight: 500 }}>Ver</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", justifyContent: "center", marginTop: "1rem", fontSize: "0.875rem", color: "#6B5B52" }}>
              <button disabled={filtros.page === 1} onClick={() => setFiltros(p => ({ ...p, page: p.page - 1 }))}
                style={{ padding: "0.4rem 0.8rem", border: "1px solid #DCC3AA", borderRadius: "6px", cursor: "pointer", background: "white" }}>
                ← Anterior
              </button>
              <span>Página {filtros.page} de {totalPaginas}</span>
              <button disabled={filtros.page === totalPaginas} onClick={() => setFiltros(p => ({ ...p, page: p.page + 1 }))}
                style={{ padding: "0.4rem 0.8rem", border: "1px solid #DCC3AA", borderRadius: "6px", cursor: "pointer", background: "white" }}>
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}