import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Fornecedores extends BaseSchema {
  protected tableName = 'fornecedores'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nome').notNullable()
      table.string('telefone').notNullable()
      table.text('observacao').nullable()
      table.timestamp('created_at').defaultTo(this.now()).notNullable()
      table.timestamp('updated_at').defaultTo(this.now()).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
