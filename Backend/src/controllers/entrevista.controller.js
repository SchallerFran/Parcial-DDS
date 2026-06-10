import * as entrevistaService from '../services/entrevista.service.js'

const listar = async (req, res, next) => {
    try {
        const resultado = await entrevistaService.listar(req.query)
        res.status(200).json(resultado)
    } catch (err) {
        next(err)
    }
}

const obtenerPorId = async (req, res, next) => {
    try {
        const entrevista = await entrevistaService.obtenerPorId(req.params.id)
        res.status(200).json(entrevista)
    } catch (err) {
        next(err)
    }
}

const obtenerHistorial = async (req, res, next) => {
    try {
        const historial = await entrevistaService.obtenerHistorial(req.params.id)
        res.status(200).json(historial)
    } catch (err) {
        next(err)
    }
}

const resumen = async (req, res, next) => {
    try {
        const datos = await entrevistaService.resumen()
        res.status(200).json(datos)
    } catch (err) {
        next(err)
    }
}

const crear = async (req, res, next) => {
    try {
        const entrevista = await entrevistaService.crear(req.body, req.usuario.id)
        res.status(201).json(entrevista)
    } catch (err) {
        next(err)
    }
}

const actualizar = async (req, res, next) => {
    try {
        const entrevista = await entrevistaService.actualizar(req.params.id, req.body, req.usuario.id)
        res.status(200).json(entrevista)
    } catch (err) {
        next(err)
    }
}

const reprogramar = async (req, res, next) => {
    try {
        const entrevista = await entrevistaService.reprogramar(req.params.id, req.body, req.usuario.id)
        res.status(200).json(entrevista)
    } catch (err) {
        next(err)
    }
}

const cancelar = async (req, res, next) => {
    try {
        const entrevista = await entrevistaService.cancelar(req.params.id, req.usuario.id)
        res.status(200).json(entrevista)
    } catch (err) {
        next(err)
    }
}

const realizar = async (req, res, next) => {
    try {
        const entrevista = await entrevistaService.realizar(req.params.id, req.body.observaciones, req.usuario.id)
        res.status(200).json(entrevista)
    } catch (err) {
        next(err)
    }
}

export { listar, obtenerPorId, obtenerHistorial, resumen, crear, actualizar, reprogramar, cancelar, realizar }
