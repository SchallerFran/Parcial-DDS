import { jest, describe, test, expect, beforeEach } from '@jest/globals'
import request from 'supertest'
import jwt from 'jsonwebtoken'

process.env.JWT_SECRET = 'test-secret'

jest.unstable_mockModule('../src/models/index.js', () => ({
    Entrevista: { findOne: jest.fn(), findAll: jest.fn(), findByPk: jest.fn(), findAndCountAll: jest.fn(), count: jest.fn(), create: jest.fn() },
    Postulante: { findOne: jest.fn(), findAll: jest.fn(), findByPk: jest.fn(), create: jest.fn() },
    Usuario: { findOne: jest.fn(), findAll: jest.fn(), findByPk: jest.fn(), create: jest.fn() },
    HistorialEntrevista: { create: jest.fn(), findAll: jest.fn() },
    sequelize: { fn: jest.fn(), col: jest.fn() }
}))

jest.unstable_mockModule('../src/services/auth.service.js', () => ({
    default: { registrar: jest.fn(), login: jest.fn() }
}))

const { default: app } = await import('../src/app.js')
const { default: authService } = await import('../src/services/auth.service.js')

// Token con rol insuficiente para rutas de rrhh/admin
const TOKEN_ENTREVISTADOR = jwt.sign({ id: 2, rol: 'entrevistador', nombre: 'Entrevistador' }, 'test-secret')

beforeEach(() => jest.clearAllMocks())

// ── 1. Login correcto e inválido ──────────────────────────────

describe('POST /api/auth/login', () => {
    test('login correcto: devuelve 200 con token y datos del usuario', async () => {
        authService.login.mockResolvedValue({
            token: 'jwt-abc',
            usuario: { id: 1, nombre: 'Juan', rol: 'rrhh' }
        })

        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'juan@test.com', password: '123456' })

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('token')
        expect(res.body.usuario).toHaveProperty('rol')
    })

    test('login inválido: devuelve 401 con mensaje de error', async () => {
        authService.login.mockRejectedValue({ status: 401, message: 'Credenciales inválidas' })

        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'juan@test.com', password: 'wrong' })

        expect(res.status).toBe(401)
        expect(res.body).toHaveProperty('error')
    })
})

// ── 7. Acceso sin JWT a rutas protegidas ──────────────────────

describe('Acceso sin JWT', () => {
    test('GET /api/entrevistas devuelve 401', async () => {
        const res = await request(app).get('/api/entrevistas')
        expect(res.status).toBe(401)
        expect(res.body).toHaveProperty('error')
    })

    test('POST /api/entrevistas devuelve 401', async () => {
        const res = await request(app).post('/api/entrevistas').send({})
        expect(res.status).toBe(401)
    })
})

// ── 8. Acceso con JWT de entrevistador a rutas de rrhh/admin ──

describe('Acceso con rol insuficiente (entrevistador)', () => {
    test('POST /api/entrevistas devuelve 403', async () => {
        const res = await request(app)
            .post('/api/entrevistas')
            .set('Authorization', `Bearer ${TOKEN_ENTREVISTADOR}`)
            .send({})

        expect(res.status).toBe(403)
        expect(res.body).toHaveProperty('error')
    })

    test('PUT /api/entrevistas/:id devuelve 403', async () => {
        const res = await request(app)
            .put('/api/entrevistas/ent-001')
            .set('Authorization', `Bearer ${TOKEN_ENTREVISTADOR}`)
            .send({})

        expect(res.status).toBe(403)
    })
})
