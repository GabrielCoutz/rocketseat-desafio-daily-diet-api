import fastify from 'fastify'
import { dietsRoutes } from './routes/diets'
import { env } from './env/index'
import fastifyCookie from '@fastify/cookie'
import { usersRoutes } from './routes/users'

const app = fastify()

app.register(fastifyCookie)

app.register(dietsRoutes, {
  prefix: '/diets',
})

app.register(usersRoutes, {
  prefix: '/users',
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => console.log(`Server is running on port ${env.PORT}`))
