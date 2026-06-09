import jwt from 'jsonwebtoken'

export default (req, res, next) => {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' })
  }
  try {
    req.usuario = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' })
  }
}

//verifica que el request traiga un JWT válido en el header Authorization: Bearer <token>. Si lo tiene, decodifica el token y guarda los datos del usuario en req.usuario para que los próximos middlewares y controllers puedan usarlos. Si no, corta y devuelve 401.