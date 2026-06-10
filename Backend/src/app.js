import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import postulanteRoutes from './routes/postulante.routes.js'
import entrevistaRoutes from './routes/entrevista.routes.js'
import errorsMiddleware from './middlewares/errors.middleware.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/postulantes', postulanteRoutes)
app.use('/api/entrevistas', entrevistaRoutes)

app.use(errorsMiddleware)

export default app
