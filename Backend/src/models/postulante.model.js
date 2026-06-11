import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'

export const Postulante = sequelize.define('Postulante', {
  id:        { type: DataTypes.STRING, primaryKey: true, unique: true, allowNull: false },
  nombre:    { type: DataTypes.STRING, allowNull: false },
  apellido:  { type: DataTypes.STRING, allowNull: false },
  email:     { type: DataTypes.STRING, allowNull: false, unique: true },
  telefono:  { type: DataTypes.STRING, allowNull: true },
  puesto:    { type: DataTypes.STRING, allowNull: true },
  estado:    { type: DataTypes.ENUM('nuevo', 'en_proceso', 'rechazado', 'contratado'), allowNull: false }
}, {
  hooks: {
    beforeCreate: async (postulante) => {
      const count = await Postulante.count()
      postulante.id = `post-${String(count + 1).padStart(3, '0')}`
    }
  }
})
