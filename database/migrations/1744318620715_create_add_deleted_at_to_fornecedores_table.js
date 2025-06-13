import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'fornecedores';
    async up() {
        this.schema.alterTable(this.tableName, (table) => {
            table.dateTime('deleted_at').nullable();
        });
    }
    async down() {
        this.schema.alterTable(this.tableName, (table) => {
            table.dropColumn('deleted_at');
        });
    }
}
//# sourceMappingURL=1744318620715_create_add_deleted_at_to_fornecedores_table.js.map