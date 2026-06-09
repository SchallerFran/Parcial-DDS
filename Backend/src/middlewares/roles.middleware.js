export default (...rolesPermitidos) => (req, res, next) => {
  if (!rolesPermitidos.includes(req.usuario.rol)) {
    return res.status(403).json({ error: 'No tenés permisos para esta acción' })
  }
  next()
}

//después de que auth.middleware confirmó quién es el usuario, este verifica si su rol está autorizado para esa acción puntual. Si no, devuelve 403.