import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import cors from 'cors'
import dotenv from 'dotenv'
import routes from './routes.js'

dotenv.config()

const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(express.json())

const { index } = routes
app.use('/', index)
app.use('*', (req, res) => res.status(400).json())

console.log('Connecting...')
mongoose.set('strictQuery', true)
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true })
  .then(() => app.listen(process.env.PORT))
  .then(() => console.log('Connected to the FHP API'))
  .catch((err) => console.log(err))

export default app
