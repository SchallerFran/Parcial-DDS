import usuariosService from '../services/usuarios.service.js'

// devuelve todos los usuarios sin passwordHash
const listar = async (req, res, next) => {
  try {
    const usuarios = await usuariosService.listar(req.query)
    res.status(200).json(usuarios)
  } catch (err) {
    next(err)
  }
}

//  devuelve un usuario por su id 
const obtenerPorId = async (req, res, next) => {
  try {
    const usuario = await usuariosService.obtenerPorId(req.params.id)
    res.status(200).json(usuario)
  } catch (err) {
    next(err) // si no existe, el service lanza 404 y lo atrapa errors.middleware
  }
}

// devuelve solo usuarios con rol entrevistador y activo true
const listarEntrevistadores = async (req, res, next) => {
  try {
    const entrevistadores = await usuariosService.listarEntrevistadores()
    res.status(200).json(entrevistadores)
  } catch (err) {
    next(err)
  }
}

// crea un nuevo usuario, hashea la contraseña en el service    
const crear = async (req, res, next) => {
  try {
    // req.body contiene nombre, email, password, rol
    const usuario = await usuariosService.crear(req.body)
    res.status(201).json(usuario) // 201 = creado exitosamente
  } catch (err) {
    next(err)
  }
}

// actualiza datos del usuario, no permite cambiar password por acá
const actualizar = async (req, res, next) => {
  try {
    const usuario = await usuariosService.actualizar(req.params.id, req.body)
    res.status(200).json(usuario)
  } catch (err) {
    next(err)
  }
}

// desactiva un usuario sin borrarlo de la base
const desactivar = async (req, res, next) => {
  try {
    const usuario = await usuariosService.desactivar(req.params.id)
    res.status(200).json(usuario)
  } catch (err) {
    next(err)
  }
}

export { listar, obtenerPorId, listarEntrevistadores, crear, actualizar, desactivar }