import {BaseSchema } from '@adonisjs/lucid/schema'

export default class CreateUnidadesTable extends BaseSchema {
  protected tableName = 'unidades'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('nome').notNullable()
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}