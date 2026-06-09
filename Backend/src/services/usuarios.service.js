import bcrypt from 'bcrypt'
import { Usuario } from '../models'

const listar = async (filtros = {}) => {
  return Usuario.findAll({
    where: filtros,
    attributes: { exclude: ['passwordHash'] } // nunca devolver el hash
  })
}

const obtenerPorId = async (id) => {
  const usuario = await Usuario.findByPk(id, {
    attributes: { exclude: ['passwordHash'] }
  })
  if (!usuario) throw { status: 404, message: 'Usuario no encontrado' }
  return usuario
}

const listarEntrevistadores = async () => {
  return Usuario.findAll({
    where: { rol: 'entrevistador', activo: true },
    attributes: ['id', 'nombre', 'email']
  })
}

const crear = async ({ nombre, email, password, rol }) => {
  const existe = await Usuario.findOne({ where: { email } })
  if (existe) throw { status: 400, message: 'El email ya está registrado' }

  const passwordHash = await bcrypt.hash(password, 10)
  const usuario = await Usuario.create({ nombre, email, passwordHash, rol })
  const { passwordHash: _, ...sinHash } = usuario.toJSON()
  return sinHash
}

const actualizar = async (id, datos) => {
  const usuario = await obtenerPorId(id)
  // no permitir cambiar password por acá
  delete datos.passwordHash
  delete datos.password
  return usuario.update(datos)
}

const desactivar = async (id) => {
  const usuario = await obtenerPorId(id)
  return usuario.update({ activo: false })
}

export { listar, obtenerPorId, listarEntrevistadores, crear, actualizar, desactivar }