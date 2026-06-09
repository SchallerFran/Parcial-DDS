import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Usuario } from '../models/usuario.model.js'

const registrar = async ({ nombre, email, password, rol }) => {
  const existe = await Usuario.findOne({ where: { email } })
  if (existe) throw { status: 400, message: 'El email ya está registrado' }

  const passwordHash = await bcrypt.hash(password, 12)
  return Usuario.create({ nombre, email, passwordHash, rol })
}

const login = async ({ email, password }) => {
  const usuario = await Usuario.findOne({ where: { email, activo: true } })
  if (!usuario) throw { status: 401, message: 'Credenciales inválidas' }

  const ok = await bcrypt.compare(password, usuario.passwordHash)
  if (!ok) throw { status: 401, message: 'Credenciales inválidas' }

  const token = jwt.sign(
    { id: usuario.id, rol: usuario.rol, nombre: usuario.nombre }, // sin passwordHash
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  )
  return { token, usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol } }
}

module.exports = { registrar, login }