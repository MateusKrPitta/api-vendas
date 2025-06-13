import { BaseSchema } from '@adonisjs/lucid/schema';
export default class AddUnidadeIdToUsersTable extends BaseSchema {
    tableName = 'users';
    async up() {
        this.schema.alterTable(this.tableName, (table) => {
            table
                .integer('unidade_id')
                .unsigned()
                .references('id')
                .inTable('unidades')
                .onDelete('CASCADE')
                .nullable();
        });
    }
    async down() {
        this.schema.alterTable(this.tableName, (table) => {
            table.dropColumn('unidade_id');
        });
    }
}
//# sourceMappingURL=1744206240000_create_add_unidade_id_to_users_table.js.map