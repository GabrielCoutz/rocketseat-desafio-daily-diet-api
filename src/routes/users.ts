import { FastifyInstance } from 'fastify'
import { userSchema } from '../schemas/user'
import { knex } from '../db'
import { randomUUID } from 'node:crypto'

export const usersRoutes = async (app: FastifyInstance) => {
  app.post('/', async (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = userSchema.parse(req.body) // password should be hashed before insert in db. But for this project I'm not going to do that. =)

    const userId = randomUUID()

    await knex('users').insert({
      ...user,
      id: userId,
      password: randomUUID(), // i make this way cuz this project does not has login routes and password will not be used
    })

    res.cookie('sessionId', userId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    res.status(201).send()
  })
}
