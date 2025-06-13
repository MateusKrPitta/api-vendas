import { BaseSchema } from '@adonisjs/lucid/schema';
export default class AddAtivoToCategorias extends BaseSchema {
    tableName = 'categorias';
    async up() {
        this.schema.alterTable(this.tableName, (table) => {
            table.boolean('ativo').defaultTo(true);
        });
    }
    async down() {
        this.schema.alterTable(this.tableName, (table) => {
            table.dropColumn('ativo');
        });
    }
}
//# sourceMappingURL=1744902891138_create_add_ativo_to_categorias_table.js.map