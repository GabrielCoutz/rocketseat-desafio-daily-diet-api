import { FastifyInstance } from 'fastify'
import { knex } from '../db'
import z from 'zod'
import { randomUUID } from 'node:crypto'
import { dietSchema } from '../schemas/diet'

export const dietsRoutes = async (app: FastifyInstance) => {
  app.get('/', async (_, res) => {
    const dietsList = await knex('diets').select('*')

    return res.status(200).send({ dietsList })
  })

  app.post('/', async (req, res) => {
    const payload = dietSchema.parse(req.body)

    await knex('diets').insert({
      ...payload,
      id: randomUUID(),
    })

    return res.status(201).send()
  })

  app.patch('/:id', async (req, res) => {
    const paramsSchema = z.object({
      id: z.uuid(),
    })

    const { id: dietID } = paramsSchema.parse(req.params)

    const payload = dietSchema.partial().parse(req.body)

    const updatedDietResult = await knex('diets')
      .update(payload)
      .where('id', dietID)

    if (updatedDietResult === 0) return res.status(404).send()

    return res.status(200).send()
  })

  app.delete('/:id', async (req, res) => {
    const paramsSchema = z.object({
      id: z.uuid(),
    })

    const { id: dietID } = paramsSchema.parse(req.params)

    const deletedDietResult = await knex('diets').where('id', dietID).del()

    if (deletedDietResult === 0) return res.status(404).send()

    res.status(204).send()
  })
}
