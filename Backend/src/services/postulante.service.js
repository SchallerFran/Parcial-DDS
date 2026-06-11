import { Postulante } from '../models/index.js'

const listar = async ({
  estado,
  puesto,
  page = 1,
  limit = 10,
  sortBy = 'nombre',
  order = 'ASC'
} = {}) => {
  const where = {}
  if (estado) where.estado = estado
  if (puesto) where.puesto = puesto

  const result = await Postulante.findAndCountAll({
    where,
    order: [[sortBy, order]],
    limit: Number(limit),
    offset: (Number(page) - 1) * Number(limit)
  })

  return {
    total: result.count,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(result.count / Number(limit)),
    data: result.rows
  }
}

const obtenerPorId = async (id) => {
  const postulante = await Postulante.findByPk(id)
  if (!postulante) throw { status: 404, message: 'Postulante no encontrado' }
  return postulante
}

const crear = async (datos) => {
  return Postulante.create(datos)
}

const actualizar = async (id, datos) => {
  const postulante = await obtenerPorId(id)
  return postulante.update(datos)
}

const eliminar = async (id) => {
  const postulante = await obtenerPorId(id)
  await postulante.destroy()
}

const ESTADOS_VALIDOS = ['nuevo', 'en_proceso', 'rechazado', 'contratado']

const cambiarEstado = async (id, nuevoEstado) => {
  if (!nuevoEstado || !ESTADOS_VALIDOS.includes(nuevoEstado)) {
    throw { status: 400, message: `Estado inválido. Debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}` }
  }
  const postulante = await obtenerPorId(id)
  return postulante.update({ estado: nuevoEstado })
}

export default { listar, obtenerPorId, crear, actualizar, eliminar, cambiarEstado }
