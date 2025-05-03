import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_unidades'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('unidade_id').unsigned().references('id').inTable('unidades').onDelete('CASCADE')
      table.unique(['user_id', 'unidade_id']) // Impede duplicatas
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}