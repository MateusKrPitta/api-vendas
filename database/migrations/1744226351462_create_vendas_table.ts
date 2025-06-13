import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Vendas extends BaseSchema {
  protected tableName = 'vendas'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('nome')
      table.integer('quantidade')
      table.float('valor')
      table.integer('forma_pagamento')
      table.integer('unidade_id').unsigned().references('id').inTable('unidades')

      // Usando raw() de forma mais explícita
      table.timestamp('data_venda')

      table.timestamps()
    })
  }

  public async down() {
    this.schema.dropTableIfExists(this.tableName)
  }
}
