export default (err, req, res, next) => {
  const status = err.status || 500
  const message = err.message || 'Error interno del servidor'
  res.status(status).json({ error: message })
}

//atrapa cualquier error lanzado en services o controllers (cuando hacen throw o next(err)) y devuelve una respuesta JSON consistente.