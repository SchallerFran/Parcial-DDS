import api from "../config/axio";

const authService = {
    // Iniciar sesion
    async login(email, password) {
        const {data} = await api.post("auth/login", {email, password});
        
        // Guardar token y usuario si el login es exitoso
        localStorage.setItem("token", data.token); 
        localStorage.setItem("usuario", JSON.stringify(data.usuario)); 
        return data;
    },

    // Registrar usuario
    async register(nombre, email, password, rol = "entrevistador") {
    const { data } = await api.post("/auth/register", { nombre, email, password, rol })
    return data
    },
    
    // Loguear usuario
    logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("usuario")
    },

    // Usuario guardado
    getUsuarioGuardado() {    
        const userLog = localStorage.getItem("usuario")    
        return userLog ? JSON.parse(userLog) : null  
    },

    // Token y autenticacion
    getToken() {    
    return localStorage.getItem("token")
    },

    estaAutenticado() {
    return !!localStorage.getItem("token")
    }
};

export default authService