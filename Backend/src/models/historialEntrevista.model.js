import { DataTypes } from 'sequelize'
import {sequelize} from '../config/db.js'

export const HistorialEntrevista = sequelize.define('HistorialEntrevista', {
  id: { type: DataTypes.STRING, primaryKey: true, unique: true },
  entrevistaId: { type: DataTypes.STRING, allowNull: false },
  usuarioId: { type: DataTypes.INTEGER, allowNull: false },
  accion: { type: DataTypes.STRING, allowNull: false },
  fechaHora: { type: DataTypes.STRING, allowNull: false },
  valorAnterior: { type: DataTypes.STRING, allowNull: true },
  valorNuevo: { type: DataTypes.STRING, allowNull: true }
})

