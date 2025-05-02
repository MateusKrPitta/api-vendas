import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddAtivoToUnidades extends BaseSchema {
  protected tableName = 'unidades'

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
