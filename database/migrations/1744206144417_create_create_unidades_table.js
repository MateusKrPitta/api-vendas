import { BaseSchema } from '@adonisjs/lucid/schema';
export default class CreateUnidadesTable extends BaseSchema {
    tableName = 'unidades';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary();
            table.string('nome').notNullable();
            table.timestamps(true);
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1744206144417_create_create_unidades_table.js.map