import { BaseSchema } from '@adonisjs/lucid/schema'

export default class ListaCompras extends BaseSchema {
  protected tableName = 'lista_compras'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('produto').notNullable()
      table.integer('quantidade').unsigned().notNullable()
      table.timestamps(true) // created_at e updated_at
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
