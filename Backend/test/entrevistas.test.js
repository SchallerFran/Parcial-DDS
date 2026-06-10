import { jest, describe, test, expect, beforeEach } from '@jest/globals'
import request from 'supertest'
import jwt from 'jsonwebtoken'

process.env.JWT_SECRET = 'test-secret'

jest.unstable_mockModule('../src/models/index.js', () => ({
    Entrevista: {
        findOne: jest.fn(),
        create: jest.fn(),
        findByPk: jest.fn(),
        findAll: jest.fn(),
        findAndCountAll: jest.fn(),
        count: jest.fn()
    },
    Postulante: { findByPk: jest.fn(), count: jest.fn() },
    Usuario: { findByPk: jest.fn() },
    HistorialEntrevista: { create: jest.fn(), findAll: jest.fn() },
    sequelize: { fn: jest.fn(), col: jest.fn() }
}))

const { default: app } = await import('../src/app.js')
const { Entrevista, Postulante, Usuario, HistorialEntrevista } = await import('../src/models/index.js')

const TOKEN = jwt.sign({ id: 1, rol: 'rrhh', nombre: 'RRHH' }, 'test-secret')

const bodyValido = {
    postulanteId: 'post-001',
    entrevistadorId: 1,
    fecha: '2026-06-20',
    horaInicio: '10:00',
    horaFin: '11:00',
    modalidad: 'presencial',
    ubicacion: 'Oficina A'
}

beforeEach(() => {
    jest.clearAllMocks()
    Entrevista.findOne.mockResolvedValue(null)      // sin superposición por defecto
    HistorialEntrevista.create.mockResolvedValue({})
})

// ── 2. Listado con y sin filtros ──────────────────────────────

describe('GET /api/entrevistas', () => {
    test('sin filtros: devuelve 200 con paginación y data', async () => {
        Entrevista.findAndCountAll.mockResolvedValue({
            count: 1,
            rows: [{ id: 'ent-001', estado: 'programada' }]
        })

        const res = await request(app)
            .get('/api/entrevistas')
            .set('Authorization', `Bearer ${TOKEN}`)

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('total', 1)
        expect(res.body).toHaveProperty('data')
        expect(Array.isArray(res.body.data)).toBe(true)
    })

    test('con filtro ?estado=programada: devuelve 200 y llama al modelo', async () => {
        Entrevista.findAndCountAll.mockResolvedValue({ count: 0, rows: [] })

        const res = await request(app)
            .get('/api/entrevistas?estado=programada')
            .set('Authorization', `Bearer ${TOKEN}`)

        expect(res.status).toBe(200)
        expect(Entrevista.findAndCountAll).toHaveBeenCalled()
    })
})

// ── 3. Detalle de entrevista existente e inexistente ──────────

describe('GET /api/entrevistas/:id', () => {
    test('entrevista existente: devuelve 200 con el objeto', async () => {
        Entrevista.findByPk.mockResolvedValue({ id: 'ent-001', estado: 'programada' })

        const res = await request(app)
            .get('/api/entrevistas/ent-001')
            .set('Authorization', `Bearer ${TOKEN}`)

        expect(res.status).toBe(200)
        expect(res.body.id).toBe('ent-001')
    })

    test('entrevista inexistente: devuelve 404 con mensaje de error', async () => {
        Entrevista.findByPk.mockResolvedValue(null)

        const res = await request(app)
            .get('/api/entrevistas/no-existe')
            .set('Authorization', `Bearer ${TOKEN}`)

        expect(res.status).toBe(404)
        expect(res.body).toHaveProperty('error')
    })
})

// ── 4. Creación válida ────────────────────────────────────────

describe('POST /api/entrevistas — válido', () => {
    test('devuelve 201 con la entrevista creada en estado programada', async () => {
        Postulante.findByPk.mockResolvedValue({ estado: 'en_proceso' })
        Usuario.findByPk.mockResolvedValue({ id: 1, rol: 'entrevistador' })
        const creada = { id: 'ent-001', ...bodyValido, estado: 'programada' }
        Entrevista.create.mockResolvedValue({ ...creada, toJSON: () => creada })

        const res = await request(app)
            .post('/api/entrevistas')
            .set('Authorization', `Bearer ${TOKEN}`)
            .send(bodyValido)

        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty('id')
        expect(res.body.estado).toBe('programada')
    })
})

// ── 5. Creación inválida por horario inconsistente ────────────

describe('POST /api/entrevistas — horario', () => {
    test('devuelve 400 si horaInicio >= horaFin', async () => {
        const res = await request(app)
            .post('/api/entrevistas')
            .set('Authorization', `Bearer ${TOKEN}`)
            .send({ ...bodyValido, horaInicio: '11:00', horaFin: '10:00' })

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('error')
    })
})

// ── 6. Creación inválida por superposición ────────────────────

describe('POST /api/entrevistas — superposición', () => {
    test('devuelve 400 si el entrevistador ya tiene una entrevista en ese horario', async () => {
        Postulante.findByPk.mockResolvedValue({ estado: 'en_proceso' })
        // findOne retorna una entrevista existente → hay superposición
        Entrevista.findOne.mockResolvedValue({ id: 'ent-conflicto' })

        const res = await request(app)
            .post('/api/entrevistas')
            .set('Authorization', `Bearer ${TOKEN}`)
            .send(bodyValido)

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('error')
    })
})

// ── 9. Reprogramación inválida por superposición ──────────────

describe('PATCH /api/entrevistas/:id/reprogramar — superposición', () => {
    test('devuelve 400 si el nuevo horario superpone con otra entrevista', async () => {
        Entrevista.findByPk.mockResolvedValue({
            id: 'ent-001',
            estado: 'programada',
            entrevistadorId: 1,
            toJSON: () => ({ id: 'ent-001', estado: 'programada', entrevistadorId: 1 }),
            update: jest.fn()
        })
        // Hay una entrevista que ocupa el nuevo horario
        Entrevista.findOne.mockResolvedValue({ id: 'ent-conflicto' })

        const res = await request(app)
            .patch('/api/entrevistas/ent-001/reprogramar')
            .set('Authorization', `Bearer ${TOKEN}`)
            .send({ fecha: '2026-07-01', horaInicio: '09:00', horaFin: '10:00' })

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('error')
    })
})

// ── 10. Validación de modalidad ───────────────────────────────

describe('POST /api/entrevistas — modalidad', () => {
    test('virtual sin link: devuelve 400', async () => {
        const res = await request(app)
            .post('/api/entrevistas')
            .set('Authorization', `Bearer ${TOKEN}`)
            .send({ ...bodyValido, modalidad: 'virtual', link: null })

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('error')
    })

    test('presencial sin ubicacion: devuelve 400', async () => {
        const res = await request(app)
            .post('/api/entrevistas')
            .set('Authorization', `Bearer ${TOKEN}`)
            .send({ ...bodyValido, ubicacion: null })

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('error')
    })
})
