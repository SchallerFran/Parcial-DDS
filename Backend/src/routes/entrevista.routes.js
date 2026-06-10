import { Router } from 'express'
import { listar, obtenerPorId, obtenerHistorial, resumen, crear, actualizar, reprogramar, cancelar, realizar } from '../controllers/entrevista.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'
import rolesMiddleware from '../middlewares/roles.middleware.js'

const router = Router()

router.use(authMiddleware)

// Rutas de lectura (todos los roles autenticados)
router.get('/', listar)
router.get('/resumen', resumen)
router.get('/:id', obtenerPorId)
router.get('/:id/historial', obtenerHistorial)

// Rutas de escritura
router.post('/', rolesMiddleware('rrhh', 'admin'), crear)
router.put('/:id', rolesMiddleware('rrhh', 'admin'), actualizar)
router.patch('/:id/reprogramar', rolesMiddleware('rrhh', 'admin'), reprogramar)
router.patch('/:id/cancelar', rolesMiddleware('rrhh', 'admin'), cancelar)
router.patch('/:id/realizar', rolesMiddleware('entrevistador', 'rrhh', 'admin'), realizar)

export default router
