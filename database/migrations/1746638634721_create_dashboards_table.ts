// database/migrations/XXXXXXXXXXXX_dashboards.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'dashboards'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('unidade_id').unsigned().references('id').inTable('unidades').notNullable()
      table.integer('total_quantidade_produtos').defaultTo(0)
      table.decimal('valor_total_vendas', 12, 2).defaultTo(0)
      table.decimal('valor_total_saidas', 12, 2).defaultTo(0)
      table.integer('quantidade_categorias').defaultTo(0)
      table.json('categorias_mais_vendidas')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}