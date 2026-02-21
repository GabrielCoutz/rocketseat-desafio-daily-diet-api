import { FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../db'

export const verifyUserSessionId = async (
  req: FastifyRequest,
  res: FastifyReply,
) => {
  const sessionId = req.cookies?.sessionId
  if (!sessionId) return res.status(401).send()

  const userFoundInDB = await knex('users').where('id', sessionId).first()

  if (!userFoundInDB) {
    res.clearCookie('sessionId')
    return res.status(401).send()
  }
}
