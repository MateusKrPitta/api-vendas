import { BaseSchema } from '@adonisjs/lucid/schema';
export default class AddStatusToFornecedores extends BaseSchema {
    tableName = 'fornecedores';
    async up() {
        this.schema.alterTable(this.tableName, (table) => {
            table.enum('status', ['ativo', 'inativo']).defaultTo('ativo');
        });
    }
    async down() {
        this.schema.alterTable(this.tableName, (table) => {
            table.dropColumn('status');
        });
    }
}
//# sourceMappingURL=1744641473909_create_add_status_to_fornecedores_table.js.map