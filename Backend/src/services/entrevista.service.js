import { Op } from 'sequelize'
import { Entrevista, Postulante, Usuario, HistorialEntrevista, sequelize } from '../models/index.js'

// ============================================================
// HELPERS DE VALIDACIÓN (uso interno del service)
// ============================================================

const validarHorario = (horaInicio, horaFin) => {
    if (horaInicio >= horaFin) {
        throw { status: 400, message: 'La hora de inicio debe ser menor que la hora de fin' }
    }
}

const validarModalidad = (modalidad, ubicacion, link) => {
    if (modalidad === 'virtual' && !link) {
        throw { status: 400, message: 'Las entrevistas virtuales requieren un link' }
    }
    if (modalidad === 'presencial' && !ubicacion) {
        throw { status: 400, message: 'Las entrevistas presenciales requieren una ubicación' }
    }
}

const validarPostulanteElegible = async (postulanteId) => {
    const postulante = await Postulante.findByPk(postulanteId)
    if (!postulante) {
        throw { status: 404, message: 'El postulante no existe' }
    }
    if (['rechazado', 'contratado'].includes(postulante.estado)) {
        throw { status: 400, message: 'El postulante no está disponible para entrevistas' }
    }
    return postulante
}

const validarSuperposicion = async ({ entrevistadorId, fecha, horaInicio, horaFin, excluirId = null }) => {
    const where = {
        entrevistadorId,
        fecha,
        estado: { [Op.in]: ['programada', 'reprogramada'] },
        // Hay superposición si: inicio_existente < fin_nuevo AND fin_existente > inicio_nuevo
        horaInicio: { [Op.lt]: horaFin },
        horaFin: { [Op.gt]: horaInicio }
    }
    if (excluirId) where.id = { [Op.ne]: excluirId }

    const conflicto = await Entrevista.findOne({ where })
    if (conflicto) {
        throw { status: 400, message: 'El entrevistador ya tiene una entrevista en ese horario' }
    }
}

const registrarHistorial = async ({ entrevistaId, usuarioId, accion, valorAnterior, valorNuevo }) => {
    return HistorialEntrevista.create({
        entrevistaId,
        usuarioId,
        accion,
        fechaHora: new Date(),
        valorAnterior: valorAnterior ? JSON.stringify(valorAnterior) : null,
        valorNuevo: valorNuevo ? JSON.stringify(valorNuevo) : null
    })
}

// ============================================================
// OPERACIONES DE LECTURA
// ============================================================

export const listar = async ({
    fecha,
    estado,
    entrevistadorId,
    postulanteId,
    page = 1,
    limit = 10,
    sortBy = 'fecha',
    order = 'ASC'
} = {}) => {
    const where = {}
    if (fecha) where.fecha = fecha
    if (estado) where.estado = estado
    if (entrevistadorId) where.entrevistadorId = entrevistadorId
    if (postulanteId) where.postulanteId = postulanteId

    const result = await Entrevista.findAndCountAll({
        where,
        include: [
            { model: Postulante, as: 'postulante' },
            { model: Usuario, as: 'entrevistador', attributes: ['id', 'nombre', 'email'] }
        ],
        order: [[sortBy, order]], 
        limit: Number(limit),
        offset: (Number(page) - 1) * Number(limit)
    })

    return {
        total: result.count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(result.count / Number(limit)),
        data: result.rows
    }
}

export const obtenerPorId = async (id) => {
    const entrevista = await Entrevista.findByPk(id, {
        include: [
            { model: Postulante, as: 'postulante' },
            { model: Usuario, as: 'entrevistador', attributes: ['id', 'nombre', 'email'] }
        ]
    })
    if (!entrevista) {
        throw { status: 404, message: 'Entrevista no encontrada' }
    }
    return entrevista
}

export const obtenerHistorial = async (id) => {
    await obtenerPorId(id) // valida que la entrevista exista
    return HistorialEntrevista.findAll({
        where: { entrevistaId: id },
        include: [{ model: Usuario, attributes: ['id', 'nombre'] }],
        order: [['fechaHora', 'DESC']]
    })
}

export const resumen = async () => {
    const hoy = new Date().toISOString().split('T')[0]

    const [entrevistasDelDia, porEntrevistador, postulantesEnProceso, entrevistasCanceladas] = await Promise.all([
        Entrevista.count({ where: { fecha: hoy } }),
        Entrevista.findAll({
            attributes: [
                'entrevistadorId',
                [sequelize.fn('COUNT', sequelize.col('Entrevista.id')), 'total']
            ],
            include: [{ model: Usuario, as: 'entrevistador', attributes: ['nombre'] }],
            group: ['entrevistadorId', 'entrevistador.id']
        }),
        Postulante.count({ where: { estado: 'en_proceso' } }),
        Entrevista.count({ where: { estado: 'cancelada' } })
    ])

    return {
        entrevistasDelDia,
        porEntrevistador,
        postulantesEnProceso,
        entrevistasCanceladas
    }
}

// ============================================================
// OPERACIONES DE ESCRITURA (con reglas de negocio)
// ============================================================

export const crear = async (datos, usuarioId) => {
    const {
        postulanteId, entrevistadorId, fecha,
        horaInicio, horaFin, modalidad,
        ubicacion, link, observaciones
    } = datos

    // Validaciones de dominio
    validarHorario(horaInicio, horaFin)
    validarModalidad(modalidad, ubicacion, link)
    await validarPostulanteElegible(postulanteId)
    await validarSuperposicion({ entrevistadorId, fecha, horaInicio, horaFin })

    // Verificar que el entrevistador existe y tiene el rol
    const entrevistador = await Usuario.findByPk(entrevistadorId)
    if (!entrevistador) {
        throw { status: 404, message: 'El entrevistador no existe' }
    }
    if (entrevistador.rol !== 'entrevistador') {
        throw { status: 400, message: 'El usuario asignado no tiene rol de entrevistador' }
    }

    const entrevista = await Entrevista.create({
        postulanteId, entrevistadorId, fecha,
        horaInicio, horaFin, modalidad,
        ubicacion, link, observaciones,
        estado: 'programada'
    })

    await registrarHistorial({
        entrevistaId: entrevista.id,
        usuarioId,
        accion: 'creación',
        valorAnterior: null,
        valorNuevo: entrevista.toJSON()
    })

    return entrevista
}

export const actualizar = async (id, datos, usuarioId) => {
    const entrevista = await obtenerPorId(id)

    // Regla: si está realizada, solo se pueden cambiar observaciones
    if (entrevista.estado === 'realizada') {
        const soloObservaciones = Object.keys(datos).every(k => k === 'observaciones')
        if (!soloObservaciones) {
            throw {
                status: 400,
                message: 'Solo se pueden modificar observaciones en entrevistas realizadas'
            }
        }
    }

    const valorAnterior = entrevista.toJSON()
    const datosNuevos = { ...valorAnterior, ...datos }

    // Si se cambia algo más que observaciones, revalidar
    if (entrevista.estado !== 'realizada') {
        validarHorario(datosNuevos.horaInicio, datosNuevos.horaFin)
        validarModalidad(datosNuevos.modalidad, datosNuevos.ubicacion, datosNuevos.link)
        await validarSuperposicion({
            entrevistadorId: datosNuevos.entrevistadorId,
            fecha: datosNuevos.fecha,
            horaInicio: datosNuevos.horaInicio,
            horaFin: datosNuevos.horaFin,
            excluirId: id
        })
    }

    await entrevista.update(datos)

    await registrarHistorial({
        entrevistaId: id,
        usuarioId,
        accion: 'edición',
        valorAnterior,
        valorNuevo: entrevista.toJSON()
    })

    return entrevista
}

export const reprogramar = async (id, datos, usuarioId) => {
    const entrevista = await obtenerPorId(id)

    if (!['programada', 'reprogramada'].includes(entrevista.estado)) {
        throw {
            status: 400,
            message: 'Solo se pueden reprogramar entrevistas en estado programada o reprogramada'
        }
    }

    const valorAnterior = entrevista.toJSON()
    const { fecha, horaInicio, horaFin, entrevistadorId } = datos

    validarHorario(horaInicio, horaFin)
    await validarSuperposicion({
        entrevistadorId: entrevistadorId || entrevista.entrevistadorId,
        fecha,
        horaInicio,
        horaFin,
        excluirId: id
    })

    await entrevista.update({
        fecha,
        horaInicio,
        horaFin,
        entrevistadorId: entrevistadorId || entrevista.entrevistadorId,
        estado: 'reprogramada'
    })

    await registrarHistorial({
        entrevistaId: id,
        usuarioId,
        accion: 'reprogramación',
        valorAnterior,
        valorNuevo: entrevista.toJSON()
    })

    return entrevista
}

export const cancelar = async (id, usuarioId) => {
    const entrevista = await obtenerPorId(id)

    if (entrevista.estado === 'realizada') {
        throw { status: 400, message: 'No se puede cancelar una entrevista que ya fue realizada' }
    }
    if (entrevista.estado === 'cancelada') {
        throw { status: 400, message: 'La entrevista ya está cancelada' }
    }

    const valorAnterior = { estado: entrevista.estado }
    await entrevista.update({ estado: 'cancelada' })

    await registrarHistorial({
        entrevistaId: id,
        usuarioId,
        accion: 'cancelación',
        valorAnterior,
        valorNuevo: { estado: 'cancelada' }
    })

    return entrevista
}

export const realizar = async (id, observaciones, usuarioId) => {
    const entrevista = await obtenerPorId(id)

    if (!['programada', 'reprogramada'].includes(entrevista.estado)) {
        throw {
            status: 400,
            message: 'Solo se pueden marcar como realizadas entrevistas programadas o reprogramadas'
        }
    }

    const valorAnterior = {
        estado: entrevista.estado,
        observaciones: entrevista.observaciones
    }

    await entrevista.update({
        estado: 'realizada',
        observaciones: observaciones || entrevista.observaciones
    })

    await registrarHistorial({
        entrevistaId: id,
        usuarioId,
        accion: 'realización',
        valorAnterior,
        valorNuevo: { estado: 'realizada', observaciones }
    })

    return entrevista
}
