import z from 'zod'

export const dietSchema = z.object({
  name: z.string().min(3),
  description: z.string(),
  date: z.string(),
  hour: z.string(),
  isOnDiet: z.boolean(),
})
