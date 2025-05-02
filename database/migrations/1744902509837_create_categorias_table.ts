import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Categorias extends BaseSchema {
  protected tableName = 'categorias'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nome').notNullable()
      table
        .integer('unidade_id')
        .unsigned()
        .references('id')
        .inTable('unidades')
        .onDelete('CASCADE') // opcional
        .notNullable()

      table.timestamps(true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
