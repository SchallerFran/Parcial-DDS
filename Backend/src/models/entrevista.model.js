import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'

export const Entrevista = sequelize.define('Entrevista', {
  id:              { type: DataTypes.STRING, primaryKey: true, unique: true, allowNull: false },
  postulanteId:    { type: DataTypes.STRING, allowNull: false },
  entrevistadorId: { type: DataTypes.INTEGER, allowNull: false },
  fecha:           { type: DataTypes.DATE, allowNull: false },
  horaInicio:      { type: DataTypes.STRING, allowNull: false },
  horaFin:         { type: DataTypes.STRING, allowNull: false },
  modalidad:       { type: DataTypes.STRING, allowNull: false },
  ubicacion:       { type: DataTypes.STRING, allowNull: true },
  link:            { type: DataTypes.STRING, allowNull: true },
  estado:          { type: DataTypes.ENUM('programada', 'realizada', 'cancelada', 'reprogramada'), allowNull: false },
  observaciones:   { type: DataTypes.STRING, allowNull: true }
}, {
  hooks: {
    beforeCreate: async (entrevista) => {
      const count = await Entrevista.count()
      entrevista.id = `ent-${1000 + count + 1}`
    }
  }
})
