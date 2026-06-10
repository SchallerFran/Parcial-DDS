import app from './app.js'
import { sequelize } from './models/index.js'

const PORT = process.env.PORT || 3000

await sequelize.authenticate()
console.log('Conexión con la base de datos establecida')

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
