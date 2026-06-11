import bcrypt from 'bcrypt'
import { sequelize, Usuario, Postulante, Entrevista, HistorialEntrevista } from '../models/index.js'

try {
  // For seed we recreate tables to ensure a fresh state
  await sequelize.sync({ force: true })

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

  const entrevistador3 = await Usuario.create({
    nombre: 'Lucía Pérez',
    email: 'lucia@dds.com',
    passwordHash: await bcrypt.hash('entrev123', 10),
    rol: 'entrevistador'
  })
  console.log(`✓ Entrevistador: lucia@dds.com / entrev123`)

  const postulantes = await Postulante.bulkCreate([
    { id: 'post-001', nombre: 'Juan', apellido: 'Martínez', email: 'juan@mail.com', telefono: '11111111', puesto: 'Frontend Junior', estado: 'nuevo' },
    { id: 'post-002', nombre: 'María', apellido: 'López', email: 'maria@mail.com', telefono: '22222222', puesto: 'Backend Junior', estado: 'nuevo' },
    { id: 'post-003', nombre: 'Carlos', apellido: 'García', email: 'carlos@mail.com', telefono: '33333333', puesto: 'QA Trainee', estado: 'rechazado' },
    { id: 'post-004', nombre: 'Ana', apellido: 'Díaz', email: 'ana@mail.com', telefono: '44444444', puesto: 'Full Stack Jr', estado: 'contratado' },
    { id: 'post-005', nombre: 'Luciano', apellido: 'Santos', email: 'luciano@mail.com', telefono: '55555555', puesto: 'Backend Jr', estado: 'en_proceso' },
    { id: 'post-006', nombre: 'Sofía', apellido: 'Castro', email: 'sofia.castro@mail.com', telefono: '66666666', puesto: 'UX Designer', estado: 'en_proceso' },
    { id: 'post-007', nombre: 'Marina', apellido: 'Fernández', email: 'marina@mail.com', telefono: '77777777', puesto: 'Frontend Jr', estado: 'nuevo' },
    { id: 'post-008', nombre: 'Tomás', apellido: 'Rojas', email: 'tomas@mail.com', telefono: '88888888', puesto: 'QA Trainee', estado: 'nuevo' },
  ])
  console.log(`✓ ${postulantes.length} postulantes creados`)

  const entrevistas = await Entrevista.bulkCreate([
    {
      id: 'ent-001',
      postulanteId: 'post-001',
      entrevistadorId: entrevistador1.id,
      fecha: '2026-06-22',
      horaInicio: '09:00',
      horaFin: '10:00',
      modalidad: 'presencial',
      ubicacion: 'Sala 1',
      link: null,
      estado: 'programada',
      observaciones: 'Primera entrevista de frontend'
    },
    {
      id: 'ent-002',
      postulanteId: 'post-002',
      entrevistadorId: entrevistador2.id,
      fecha: '2026-06-21',
      horaInicio: '11:00',
      horaFin: '12:00',
      modalidad: 'virtual',
      ubicacion: null,
      link: 'https://meet.google.com/abc-defg-hij',
      estado: 'realizada',
      observaciones: 'Buena entrevista técnica'
    },
    {
      id: 'ent-003',
      postulanteId: 'post-003',
      entrevistadorId: entrevistador3.id,
      fecha: '2026-06-20',
      horaInicio: '14:00',
      horaFin: '15:00',
      modalidad: 'presencial',
      ubicacion: 'Sala 2',
      link: null,
      estado: 'cancelada',
      observaciones: 'Postulante canceló con anticipación'
    },
    {
      id: 'ent-004',
      postulanteId: 'post-004',
      entrevistadorId: entrevistador1.id,
      fecha: '2026-06-23',
      horaInicio: '10:00',
      horaFin: '11:00',
      modalidad: 'virtual',
      ubicacion: null,
      link: 'https://meet.google.com/xyz-1234-uvw',
      estado: 'reprogramada',
      observaciones: 'Se reprogramó por conflicto de agenda'
    },
    {
      id: 'ent-005',
      postulanteId: 'post-005',
      entrevistadorId: entrevistador2.id,
      fecha: '2026-06-24',
      horaInicio: '09:30',
      horaFin: '10:15',
      modalidad: 'presencial',
      ubicacion: 'Sala 3',
      link: null,
      estado: 'programada',
      observaciones: 'Entrevista para backend junior'
    },
    {
      id: 'ent-006',
      postulanteId: 'post-006',
      entrevistadorId: entrevistador3.id,
      fecha: '2026-06-19',
      horaInicio: '16:00',
      horaFin: '17:00',
      modalidad: 'virtual',
      ubicacion: null,
      link: 'https://meet.google.com/meet-4567',
      estado: 'realizada',
      observaciones: 'Revisión de portafolio de diseño'
    },
    {
      id: 'ent-007',
      postulanteId: 'post-007',
      entrevistadorId: entrevistador1.id,
      fecha: '2026-06-25',
      horaInicio: '13:00',
      horaFin: '14:00',
      modalidad: 'presencial',
      ubicacion: 'Sala 1',
      link: null,
      estado: 'programada',
      observaciones: 'Entrevista de frontend'
    },
    {
      id: 'ent-008',
      postulanteId: 'post-008',
      entrevistadorId: entrevistador2.id,
      fecha: '2026-06-18',
      horaInicio: '15:00',
      horaFin: '16:00',
      modalidad: 'virtual',
      ubicacion: null,
      link: 'https://meet.google.com/mno-7890',
      estado: 'cancelada',
      observaciones: 'No asistió a la reunión'
    },
    {
      id: 'ent-009',
      postulanteId: 'post-001',
      entrevistadorId: entrevistador3.id,
      fecha: '2026-06-16',
      horaInicio: '10:30',
      horaFin: '11:30',
      modalidad: 'presencial',
      ubicacion: 'Sala 4',
      link: null,
      estado: 'realizada',
      observaciones: 'Segunda etapa'
    },
    {
      id: 'ent-010',
      postulanteId: 'post-002',
      entrevistadorId: entrevistador1.id,
      fecha: '2026-06-26',
      horaInicio: '12:00',
      horaFin: '13:00',
      modalidad: 'virtual',
      ubicacion: null,
      link: 'https://meet.google.com/def-1234-ghi',
      estado: 'reprogramada',
      observaciones: 'Cambio de fecha solicitado'
    },
    {
      id: 'ent-011',
      postulanteId: 'post-003',
      entrevistadorId: entrevistador2.id,
      fecha: '2026-06-17',
      horaInicio: '09:00',
      horaFin: '10:00',
      modalidad: 'presencial',
      ubicacion: 'Sala 2',
      link: null,
      estado: 'programada',
      observaciones: 'Entrevista inicial'
    },
    {
      id: 'ent-012',
      postulanteId: 'post-004',
      entrevistadorId: entrevistador3.id,
      fecha: '2026-06-15',
      horaInicio: '14:00',
      horaFin: '15:00',
      modalidad: 'virtual',
      ubicacion: null,
      link: 'https://meet.google.com/star-5678',
      estado: 'realizada',
      observaciones: 'Entrevista final'
    }
  ])
  console.log(`✓ ${entrevistas.length} entrevistas creadas`)

  // Crear registros de historial de forma secuencial para evitar colisiones
  for (const entrevista of entrevistas) {
    await HistorialEntrevista.create({
      entrevistaId: entrevista.id,
      usuarioId: admin.id,
      accion: 'creación',
      fechaHora: new Date().toISOString(),
      valorAnterior: null,
      valorNuevo: JSON.stringify(entrevista.toJSON())
    })
  }

  console.log(`✓ ${entrevistas.length} registros de historial creados`)

  console.log('Seed completado exitosamente')
  process.exit(0)
} catch (err) {
  console.error('Error durante el seed:', err)
  process.exit(1)
}
