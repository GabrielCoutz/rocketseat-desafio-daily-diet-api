// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    diets: {
      id: string
      userId: string
      name: string
      description: string
      date: string
      hour: string
      isOnDiet: boolean
      created_at: string
      updated_at: string
    }

    users: {
      id: string
      name: string
      email: string
      password: string
      photo?: string
      created_at: string
      updated_at: string
    }
  }
}
