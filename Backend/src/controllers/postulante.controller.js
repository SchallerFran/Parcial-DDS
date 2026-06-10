import postulanteService from '../services/postulante.service.js'

// devuelve todos los postulantes
const listar = async (req, res, next) => {
  try {
    const postulantes = await postulanteService.listar(req.query)
    res.status(200).json(postulantes)
  } catch (err) {
    next(err)
  }
}

// devuelve un postulante por su id
const obtenerPorId = async (req, res, next) => {
  try {
    // req.params.id viene de la URL, ej: /api/postulantes/post-001
    const postulante = await postulanteService.obtenerPorId(req.params.id)
    res.status(200).json(postulante)
  } catch (err) {
    next(err) // si no existe, el service lanza 404 y lo atrapa errors.middleware
  }
}

// crea un nuevo postulante con los datos del body
const crear = async (req, res, next) => {
  try {
    // req.body contiene nombre, apellido, email, telefono, puesto, estado
    const postulante = await postulanteService.crear(req.body)
    res.status(201).json(postulante) // 201 = creado exitosamente
  } catch (err) {
    next(err)
  }
}

// actualiza los datos de un postulante existente
const actualizar = async (req, res, next) => {
  try {
    // combina el id de la URL con los nuevos datos del body
    const postulante = await postulanteService.actualizar(req.params.id, req.body)
    res.status(200).json(postulante)
  } catch (err) {
    next(err)
  }
}

//elimina un postulante por su id
const eliminar = async (req, res, next) => {
  try {
    await postulanteService.eliminar(req.params.id)
    res.status(204).send() // 204 = éxito sin contenido para devolver
  } catch (err) {
    next(err)
  }
}

export { listar, 
        obtenerPorId, 
        crear, 
        actualizar, 
         eliminar }