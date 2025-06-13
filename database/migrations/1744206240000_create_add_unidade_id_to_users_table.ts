import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddUnidadeIdToUsersTable extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('unidade_id')
        .unsigned()
        .references('id')
        .inTable('unidades')
        .onDelete('CASCADE')
        .nullable() // Adicione .nullable() se for opcional
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('unidade_id')
    })
  }
}
