import { ValidationError, UniqueConstraintError, DatabaseError, ConnectionError } from 'sequelize'
import jwt from 'jsonwebtoken'
const { JsonWebTokenError, TokenExpiredError } = jwt

export default (err, req, res, next) => {

    // ── Errores lanzados desde los services ({ status, message }) ──
    if (err.status) {
        return res.status(err.status).json({ error: err.message })
    }

    // ── JWT ────────────────────────────────────────────────────────
    if (err instanceof TokenExpiredError) {
        return res.status(401).json({ error: 'Sesion expirada, iniciá sesión nuevamente' })
    }
    if (err instanceof JsonWebTokenError) {
        return res.status(401).json({ error: 'Token inválido' }) 
    }

    // ── Sequelize: validación de campos (allowNull, len, etc.) ─────
    if (err instanceof ValidationError) {
        const detalles = err.errors.map(e => e.message)
        return res.status(400).json({ error: 'Error de validación', detalles })
    }

    // ── Sequelize: violación de clave única (email duplicado, etc.) ─
    if (err instanceof UniqueConstraintError) {
        const campo = err.errors[0]?.path ?? 'campo'
        return res.status(409).json({ error: `Ya existe un registro con ese ${campo}` })
    }

    // ── Sequelize: error general de base de datos ──────────────────
    if (err instanceof DatabaseError) {
        return res.status(500).json({ error: 'Error en la base de datos' })
    }

    // ── Sequelize: no se pudo conectar ─────────────────────────────
    if (err instanceof ConnectionError) {
        return res.status(503).json({ error: 'No se pudo conectar a la base de datos' })
    }

    // ── JSON malformado en el body (Express parser) ────────────────
    if (err instanceof SyntaxError && 'body' in err) {
        return res.status(400).json({ error: 'El cuerpo de la solicitud tiene formato JSON inválido' })
    }

    // ── Error no controlado ────────────────────────────────────────
    console.error('[Error no controlado]', err)
    res.status(500).json({ error: 'Error interno del servidor' })
}
