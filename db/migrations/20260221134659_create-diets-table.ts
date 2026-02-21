import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('diets', (table) => {
    table.uuid('id').primary()
    table.uuid('session_id').index()
    table.string('name').notNullable()
    table.text('description').notNullable()
    table.date('date').notNullable()
    table.string('hour').notNullable()
    table.boolean('isOnDiet').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.dateTime('updated_at').notNullable().defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('diets')
}
