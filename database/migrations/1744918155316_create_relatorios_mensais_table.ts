// database/migrations/XXXXXXXX_create_relatorios_saidas_table.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class RelatoriosSaidas extends BaseSchema {
  protected tableName = 'relatorios_saidas'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('unidade_id').unsigned().references('id').inTable('unidades').notNullable()
      table.integer('ano').notNullable()
      table.integer('mes').notNullable() // 1-12
      table.json('dados').notNullable()
      table.float('total_valor').notNullable()
      table.integer('total_saidas').notNullable()
      table.unique(['unidade_id', 'ano', 'mes'])
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
