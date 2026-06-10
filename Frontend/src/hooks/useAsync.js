import { useState, useEffect } from "react"

/**
 * Hook personalizado para manejar llamadas asincrónicas
 * 
 * @param {Function} asyncFunction - La función async a ejecutar
 * @param {Boolean} immediate - Si debe ejecutarse inmediatamente al montar
 * @param {Array} dependencies - Dependencias para re-ejecutar
 * 
 * @returns {Object} { status, data, error }
 */
export function useAsync(asyncFunction, immediate = true, dependencies = []) {
    const [status, setStatus] = useState("idle")
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)

    const execute = async () => {
        setStatus("pending")
        setData(null)
        setError(null)

        try {
            const response = await asyncFunction()
            setData(response)
            setStatus("success")
            return response
        } catch (err) {
            setError(err)
            setStatus("error")
        }
    }

    useEffect(() => {
        if (immediate) {
            execute()
        }
    }, dependencies)

    return { status, data, error, execute }
}

export default useAsync
