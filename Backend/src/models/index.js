import { sequelize } from '../config/db.js'
import { Usuario } from './usuario.model.js'
import { Postulante } from './postulante.model.js'
import { Entrevista } from './entrevista.model.js'
import { HistorialEntrevista } from './historialEntrevista.model.js'

Usuario.hasMany(Entrevista, { foreignKey: 'entrevistadorId' })
Entrevista.belongsTo(Usuario, { foreignKey: 'entrevistadorId', as: 'entrevistador' })
Postulante.hasMany(Entrevista, { foreignKey: 'postulanteId' })
Entrevista.belongsTo(Postulante, { foreignKey: 'postulanteId', as: 'postulante' })
Entrevista.hasMany(HistorialEntrevista, { foreignKey: 'entrevistaId' })
HistorialEntrevista.belongsTo(Usuario, { foreignKey: 'usuarioId' })

export { sequelize, Usuario, Postulante, Entrevista, HistorialEntrevista }
