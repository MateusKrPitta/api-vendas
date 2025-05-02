import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddTipoToUsers extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('tipo').notNullable().defaultTo(1) // padrão pode ser 1
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('tipo')
    })
  }
}
