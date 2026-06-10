import api from "../config/axio"

const postulantesService = {
    // Listar todos los postulantes
    async listar() {
        const { data } = await api.get("/postulantes")
        return data
    },

    // Obtener detalle de un postulante
    async obtener(id) {
        const { data } = await api.get(`/postulantes/${id}`)
        return data
    },

    // Crear postulante
    async crear(postulante) {
        const { data } = await api.post("/postulantes", postulante)
        return data
    },

    // Editar postulante
    async editar(id, cambios) {
        const { data } = await api.put(`/postulantes/${id}`, cambios)
        return data
    },

    // Cambiar estado del postulante
    async cambiarEstado(id, nuevoEstado) {
        const { data } = await api.patch(`/postulantes/${id}/estado`, { estado: nuevoEstado })
        return data
    },
}

export default postulantesService
