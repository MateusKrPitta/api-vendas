import { BaseSchema } from '@adonisjs/lucid/schema';
export default class AddAtivoToUsers extends BaseSchema {
    tableName = 'users';
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
//# sourceMappingURL=1744209291216_create_add_ativo_to_users_table.js.map