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

export default { listar, obtenerPorId, crear, actualizar, eliminar }
