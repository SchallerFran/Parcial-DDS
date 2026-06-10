import api from "../config/axio"

const entrevistasService = {
    // Listar entrevistas con filtros
    async listar(filtros = {}) {
        const params = new URLSearchParams()
        if (filtros.fecha) params.append("fecha", filtros.fecha)
        if (filtros.estado) params.append("estado", filtros.estado)
        if (filtros.entrevistadorId) params.append("entrevistadorId", filtros.entrevistadorId)
        if (filtros.postulanteId) params.append("postulanteId", filtros.postulanteId)
        if (filtros.page) params.append("page", filtros.page)
        if (filtros.limit) params.append("limit", filtros.limit)
        if (filtros.sortBy) params.append("sortBy", filtros.sortBy)
        if (filtros.order) params.append("order", filtros.order)

        const { data } = await api.get(`/entrevistas?${params.toString()}`)
        return data
    },

    // Obtener detalle de una entrevista
    async obtener(id) {
        const { data } = await api.get(`/entrevistas/${id}`)
        return data
    },

    // Obtener historial de cambios
    async obtenerHistorial(id) {
        const { data } = await api.get(`/entrevistas/${id}/historial`)
        return data
    },

    // Crear entrevista
    async crear(entrevista) {
        const { data } = await api.post("/entrevistas", entrevista)
        return data
    },

    // Editar entrevista
    async editar(id, cambios) {
        const { data } = await api.put(`/entrevistas/${id}`, cambios)
        return data
    },

    // Cancelar entrevista
    async cancelar(id, observaciones = "") {
        const { data } = await api.patch(`/entrevistas/${id}/cancelar`, { observaciones })
        return data
    },

    // Marcar como realizada
    async marcarRealizada(id, observaciones = "") {
        const { data } = await api.patch(`/entrevistas/${id}/realizar`, { observaciones })
        return data
    },

    // Reprogramar entrevista
    async reprogramar(id, cambios) {
        const { data } = await api.patch(`/entrevistas/${id}/reprogramar`, cambios)
        return data
    },

    // Obtener resumen
    async obtenerResumen() {
        const { data } = await api.get("/entrevistas/resumen")
        return data
    },
}

export default entrevistasService
