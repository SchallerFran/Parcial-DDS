import { Router } from 'express'
import { listar, obtenerPorId, listarEntrevistadores, crear, actualizar, desactivar } from '../controllers/usuario.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'
import rolesMiddleware from '../middlewares/roles.middleware.js'

const router = Router()

router.use(authMiddleware)

router.get('/', rolesMiddleware('admin', 'rrhh'), listar)
router.get('/entrevistadores', listarEntrevistadores)
router.get('/:id', obtenerPorId)
router.post('/', rolesMiddleware('admin'), crear)
router.put('/:id', rolesMiddleware('admin'), actualizar)
router.patch('/:id/desactivar', rolesMiddleware('admin'), desactivar)

export default router
