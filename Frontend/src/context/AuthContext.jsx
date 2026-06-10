import { createContext, useContext, useState } from "react"
import authService from "../services/auth.service"

const AuthContext = createContext(null)

// Usuario mock para probar sin backend
const USUARIO_MOCK = {
    id: 1,
    nombre: "Fati",
    email: "fati@test.com",
    rol: "admin"
}

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(() => authService.getUsuarioGuardado())
    const [cargando, setCargando] = useState(false)
    const [error, setError] = useState(null)

    const login = async (email, password) => {
        setCargando(true)
        setError(null)
        try {
        // --- MOCK: borrar cuando el backend esté listo ---
        if (email === "fati@test.com" && password === "123456") {
            localStorage.setItem("token", "token-mock-123")
            localStorage.setItem("usuario", JSON.stringify(USUARIO_MOCK))
            setUsuario(USUARIO_MOCK)
            return USUARIO_MOCK
        }
        throw { mensaje: "Email o contraseña incorrectos" }
        // --- fin MOCK ---

        // const data = await authService.login(email, password)
        // setUsuario(data.usuario)
        // return data
        } catch (err) {
        setError(err.mensaje || "Error al iniciar sesión")
        throw err
        } finally {
        setCargando(false)
        }
    }

    const register = async (nombre, email, password, rol) => {
        setCargando(true)
        setError(null)
        try {
            // --- MOCK: borrar cuando el backend esté listo ---
            return { mensaje: "Usuario registrado correctamente" }
            // --- fin MOCK ---

            // return await authService.register(nombre, email, password, rol)
        } catch (err) {
            setError(err.mensaje || "Error al registrarse")
            throw err
        } finally {
            setCargando(false)
        }
    }

    const logout = () => {
        authService.logout()
        setUsuario(null)
    }

    const esAdmin = usuario?.rol === "admin"
    const esRRHH = usuario?.rol === "rrhh"
    const esEntrevistador = usuario?.rol === "entrevistador"
    const puedeGestionar = esAdmin || esRRHH

    return (
    <AuthContext.Provider value={{
        usuario,
        cargando,
        error,
        login,
        register,
        logout,
        esAdmin,
        esRRHH,
        esEntrevistador,
        puedeGestionar,
        estaAutenticado: !!usuario
    }}>
        {children}
    </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>")
    return ctx
}