import authService from "../services/auth.service.js";

// Recibe nombre, email, password y rol en el body
const registrar = async (req, res, next) => {
  try {
    // req.body tiene los datos del formulario de registro
    // el service se encarga de verificar si el email ya existe y hashear la contraseña
    const usuario = await authService.registrar(req.body)
    res.status(201).json(usuario)
  } catch (err) {
    next(err) // si el email ya existe, el service lanza 400 
  }
}

// Recibe email y password en el body
const login = async (req, res, next) => {
  try {
    // el service verifica credenciales y devuelve { token, usuario }
    const resultado = await authService.login(req.body)
    res.status(200).json(resultado) // devuelve el JWT y los datos básicos del usuario
  } catch (err) {
    next(err) // si las credenciales son inválidas, el service lanza 401
  }
}

export default { registrar, login }