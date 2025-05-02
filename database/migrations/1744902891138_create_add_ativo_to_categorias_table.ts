import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddAtivoToCategorias extends BaseSchema {
  protected tableName = 'categorias'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('ativo').defaultTo(true)
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('ativo')
    })
  }
}
