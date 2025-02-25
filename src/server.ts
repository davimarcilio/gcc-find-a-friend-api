import fastify from 'fastify'
import cors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import multer from 'fastify-multer'
import fastifyCookie from '@fastify/cookie'
import path from 'path'

import { appRoutes } from './routes'

const app = fastify()

app.register(cors, {
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1',
    'http://10.0.0.111:5173',
    'http://0.0.0.0:5173',
    'http://10.0.0.104:5173',
  ],
  credentials: true,
})
app.register(fastifyJwt, {
  secret: String(process.env.JWT_SECRET),
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '5m',
  },
})
// app.register(fastifyMultipart, { attachFieldsToBody: true })
app.register(multer.contentParser)
app.register(fastifyCookie)
app.register(appRoutes)

app.register(require('@fastify/static'), {
  root: path.join(__dirname, '..', 'tmp'),
  prefix: '/images/',
})

app
  .listen({
    host: '0.0.0.0',
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
  })
  .then(() => {
    console.log('HTTP Server runing')
  })
