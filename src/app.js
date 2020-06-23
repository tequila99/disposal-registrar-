import createError from 'http-errors'
// import bodyParser from 'body-parser'
import express from 'express'
import logger from 'morgan'
import cors from 'cors'

import router from './routes'

const app = express()
app.use(cors({
  origin: '*',
  methods: 'GET,PUT,POST,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization,X-Requested-With',
  preflightContinue: true
}))
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// app.use(bodyParser.json())

app.use('/api/v1', router)

app.use((req, res, next) => next(createError(404)))

app.use((err, req, res, next) => {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.status(err.status || 500).send(err.message || 'Произошла ошибка сервера')
})

export default app
