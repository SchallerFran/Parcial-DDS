import api from "../config/axios"

const usuariosService = {
    async listarEntrevistadores() {
        const { data } = await api.get("/usuarios/entrevistadores")
        return data
    }
}

export default usuariosService
