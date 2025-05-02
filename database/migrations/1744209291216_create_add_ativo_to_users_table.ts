import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddAtivoToUsers extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('ativo').notNullable().defaultTo(true)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('ativo')
    })
  }
}
