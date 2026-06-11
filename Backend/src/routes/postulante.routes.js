import { Router } from 'express'
import { listar, obtenerPorId, crear, actualizar, eliminar, cambiarEstado } from '../controllers/postulante.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'
import rolesMiddleware from '../middlewares/roles.middleware.js'

const router = Router()

router.use(authMiddleware)

router.get('/', listar)
router.get('/:id', obtenerPorId)
router.post('/', rolesMiddleware('rrhh', 'admin'), crear)
router.put('/:id', rolesMiddleware('rrhh', 'admin'), actualizar)
router.patch('/:id/estado', rolesMiddleware('rrhh', 'admin'), cambiarEstado)
router.delete('/:id', rolesMiddleware('admin'), eliminar)

export default router
