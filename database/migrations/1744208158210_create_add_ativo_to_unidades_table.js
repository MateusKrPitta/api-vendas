import { BaseSchema } from '@adonisjs/lucid/schema';
export default class AddAtivoToUnidades extends BaseSchema {
    tableName = 'unidades';
    async up() {
        this.schema.alterTable(this.tableName, (table) => {
            table.boolean('ativo').notNullable().defaultTo(true);
        });
    }
    async down() {
        this.schema.alterTable(this.tableName, (table) => {
            table.dropColumn('ativo');
        });
    }
}
//# sourceMappingURL=1744208158210_create_add_ativo_to_unidades_table.js.map