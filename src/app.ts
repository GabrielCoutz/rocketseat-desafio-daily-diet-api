import fastify from 'fastify'
import { dietsRoutes } from './routes/diets'
import { env } from './env/index'

const app = fastify()

app.register(dietsRoutes, {
  prefix: '/diets',
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => console.log(`Server is running on port ${env.PORT}`))
