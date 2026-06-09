import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

export const Entrevista = sequelize.define('Entrevista', {
  id:           { type: DataTypes.STRING, primaryKey: true, unique: true },
  postulanteId: { type: DataTypes.STRING, allowNull: false },
  entrevistadorId: { type: DataTypes.INTEGER, allowNull: false },
  fecha:          { type: DataTypes.DATE, allowNull: false },
  horaInicio:           { type: DataTypes.STRING, allowNull: false },
  horaFin:           { type: DataTypes.STRING, allowNull: false },
  modalidad:          { type: DataTypes.STRING, allowNull: false },
  lugar:          { type: DataTypes.STRING, allowNull: false },
  estado:          { type: DataTypes.ENUM('programada', 'realizada', 'cancelada', 'reprogramada'), allowNull: false },
  observaciones:    { type: DataTypes.STRING, allowNull: true }
})

