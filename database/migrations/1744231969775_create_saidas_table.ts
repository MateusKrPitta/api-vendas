// database/migrations/XXXXX_create_saidas_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class Saidas extends BaseSchema {
  protected tableName = 'saidas'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('descricao').notNullable()
      table.float('valor').notNullable()
      table.integer('forma_pagamento').notNullable()
      table.integer('unidade_id').unsigned().references('id').inTable('unidades')
      table.timestamp('data_saida')
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
