import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddCategoriaIdToVendas extends BaseSchema {
  protected tableName = 'vendas'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .integer('categoria_id')
        .unsigned()
        .references('id')
        .inTable('categorias')
        .onDelete('SET NULL') // ou 'CASCADE' se preferir
        .nullable() // ou .notNullable() se for obrigatório
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('categoria_id')
    })
  }
}
