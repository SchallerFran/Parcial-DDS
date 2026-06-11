import bcrypt from 'bcrypt'
import { sequelize, Usuario, Postulante } from '../models/index.js'

try {
  await sequelize.sync()

  const admin = await Usuario.create({
    nombre: 'Admin',
    email: 'admin@dds.com',
    passwordHash: await bcrypt.hash('admin123', 10),
    rol: 'admin'
  })
  console.log(`✓ Admin: admin@dds.com / admin123`)

  const rrhh = await Usuario.create({
    nombre: 'RRHH User',
    email: 'rrhh@dds.com',
    passwordHash: await bcrypt.hash('rrhh123', 10),
    rol: 'rrhh'
  })
  console.log(`✓ RRHH:  rrhh@dds.com / rrhh123`)

  const entrevistador1 = await Usuario.create({
    nombre: 'Sofía Luna',
    email: 'sofia@dds.com',
    passwordHash: await bcrypt.hash('entrev123', 10),
    rol: 'entrevistador'
  })
  console.log(`✓ Entrevistador: sofia@dds.com / entrev123`)

  const entrevistador2 = await Usuario.create({
    nombre: 'Pedro Ruiz',
    email: 'pedro@dds.com',
    passwordHash: await bcrypt.hash('entrev123', 10),
    rol: 'entrevistador'
  })
  console.log(`✓ Entrevistador: pedro@dds.com / entrev123`)

  const postulantes = await Postulante.bulkCreate([
    { id: 'post-001', nombre: 'Juan', apellido: 'Martínez', email: 'juan@mail.com', telefono: '11111111', puesto: 'Frontend Junior', estado: 'nuevo' },
    { id: 'post-002', nombre: 'María', apellido: 'López', email: 'maria@mail.com', telefono: '22222222', puesto: 'Backend Junior', estado: 'nuevo' },
    { id: 'post-003', nombre: 'Carlos', apellido: 'García', email: 'carlos@mail.com', telefono: '33333333', puesto: 'QA Trainee', estado: 'nuevo' },
    { id: 'post-004', nombre: 'Ana', apellido: 'Díaz', email: 'ana@mail.com', telefono: '44444444', puesto: 'Full Stack Jr', estado: 'nuevo' },
  ])
  console.log(`✓ ${postulantes.length} postulantes creados`)

  console.log('Seed completado exitosamente')
  process.exit(0)
} catch (err) {
  console.error('Error durante el seed:', err)
  process.exit(1)
}
