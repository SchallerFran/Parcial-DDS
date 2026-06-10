import { Entrevista } from "../models.js";



// registrar historial de entrevistas 

const registrarHistorial = async (entrevistaId, usuarioId, accion, valorAnterior = null, valorNuevo = null) => {
  await HistorialEntrevista.create({
    entrevistaId,
    usuarioId,
    accion,
    fechaHora: new Date().toISOString(),
    valorAnterior: valorAnterior ? JSON.stringify(valorAnterior) : null,
    valorNuevo: valorNuevo ? JSON.stringify(valorNuevo) : null
  })
}
