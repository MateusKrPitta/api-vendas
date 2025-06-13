import { BaseSchema } from '@adonisjs/lucid/schema';
export default class AddTipoToUsers extends BaseSchema {
    tableName = 'users';
    async up() {
        this.schema.alterTable(this.tableName, (table) => {
            table.integer('tipo').notNullable().defaultTo(1);
        });
    }
    async down() {
        this.schema.alterTable(this.tableName, (table) => {
            table.dropColumn('tipo');
        });
    }
}
//# sourceMappingURL=1744209690680_create_add_tipo_to_users_table.js.map