import { createContext, useContext, useState } from "react"
import authService from "../services/auth.service"

const AuthContext = createContext(null)


export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(() => authService.getUsuarioGuardado())
    const [cargando, setCargando] = useState(false)
    const [error, setError] = useState(null)

    //Login
    const login = async (email, password) => {
        setCargando(true)
        setError(null)
        try {
            const data = await authService.login(email, password)
            setUsuario(data.usuario)
            return data
        } catch (err) {
            setError(err.mensaje || "Email o contraseña incorrectos")
            throw err
        } finally {
            setCargando(false)
        }
    }

    //Regiter
    const register = async (nombre, email, password, rol) => {
    setCargando(true)
    setError(null)
    try {
        return await authService.register(nombre, email, password, rol)
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