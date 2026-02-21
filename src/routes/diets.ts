import { FastifyInstance } from 'fastify'
import { knex } from '../db'
import z from 'zod'
import { randomUUID } from 'node:crypto'
import { dietSchema } from '../schemas/diet'
import { verifyUserSessionId } from '../hooks/verifyUserSessionId'

export const dietsRoutes = async (app: FastifyInstance) => {
  app.addHook('preHandler', verifyUserSessionId)

  app.get('/', async (req, res) => {
    const sessionId = req.cookies?.sessionId

    const dietsList = await knex('diets')
      .where({
        userId: sessionId,
      })
      .select('*')

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const dietsListWithoutUserId = dietsList.map(({ userId, ...diet }) => diet)

    return res.status(200).send({ diets: dietsListWithoutUserId })
  })

  app.get('/:id', async (req, res) => {
    const paramsSchema = z.object({
      id: z.uuid(),
    })

    const { id: dietID } = paramsSchema.parse(req.params)

    const sessionId = req.cookies?.sessionId

    const dietResponse = await knex('diets')
      .where({
        id: dietID,
        userId: sessionId,
      })
      .first()

    if (!dietResponse) return res.status(404).send()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { userId, ...diet } = dietResponse

    res.status(200).send({ diet })
  })

  app.post('/', async (req, res) => {
    const payload = dietSchema.parse(req.body)
    const sessionId = req.cookies?.sessionId

    await knex('diets').insert({
      ...payload,
      id: randomUUID(),
      userId: sessionId,
    })

    return res.status(201).send()
  })

  app.patch('/:id', async (req, res) => {
    const paramsSchema = z.object({
      id: z.uuid(),
    })

    const { id: dietID } = paramsSchema.parse(req.params)

    const payload = dietSchema.partial().parse(req.body)

    const sessionId = req.cookies?.sessionId

    const updatedDietResult = await knex('diets').update(payload).where({
      id: dietID,
      userId: sessionId,
    })

    if (updatedDietResult === 0) return res.status(404).send()

    return res.status(200).send()
  })

  app.delete('/:id', async (req, res) => {
    const paramsSchema = z.object({
      id: z.uuid(),
    })

    const { id: dietID } = paramsSchema.parse(req.params)

    const sessionId = req.cookies?.sessionId

    const deletedDietResult = await knex('diets')
      .where({
        id: dietID,
        userId: sessionId,
      })
      .del()

    if (deletedDietResult === 0) return res.status(404).send()

    res.status(204).send()
  })
}
