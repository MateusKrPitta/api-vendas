import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'relatorio_mensal_vendas'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('mes').notNullable()
      table.integer('ano').notNullable()
      table
        .integer('unidade_id')
        .unsigned()
        .references('id')
        .inTable('unidades')
        .onDelete('CASCADE')
      table
        .integer('categoria_id')
        .unsigned()
        .references('id')
        .inTable('categorias')
        .onDelete('CASCADE')
      table.integer('total_vendas').notNullable()
      table.integer('total_itens_vendidos').notNullable()
      table.decimal('total_valor', 10, 2).notNullable()
      table.decimal('total_dinheiro', 10, 2).notNullable()
      table.decimal('total_cartao', 10, 2).notNullable()
      table.decimal('total_pix', 10, 2).notNullable()
      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
