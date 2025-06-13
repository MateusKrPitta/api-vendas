import { BaseSchema } from '@adonisjs/lucid/schema';
export default class Fornecedores extends BaseSchema {
    tableName = 'fornecedores';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.string('nome').notNullable();
            table.string('telefone').notNullable();
            table.text('observacao').nullable();
            table.timestamp('created_at').defaultTo(this.now()).notNullable();
            table.timestamp('updated_at').defaultTo(this.now()).notNullable();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1744223582831_create_fornecedors_table.js.map