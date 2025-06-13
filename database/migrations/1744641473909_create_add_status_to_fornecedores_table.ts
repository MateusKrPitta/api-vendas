import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddStatusToFornecedores extends BaseSchema {
  protected tableName = 'fornecedores'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.enum('status', ['ativo', 'inativo']).defaultTo('ativo')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('status')
    })
  }
}
