import { Postulante } from '../models'

const listar = async (filtros = {}) => {
  return Postulante.findAll({ where: filtros })
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

export { listar, obtenerPorId, crear, actualizar, eliminar }