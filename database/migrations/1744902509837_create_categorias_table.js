import { BaseSchema } from '@adonisjs/lucid/schema';
export default class Categorias extends BaseSchema {
    tableName = 'categorias';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.string('nome').notNullable();
            table
                .integer('unidade_id')
                .unsigned()
                .references('id')
                .inTable('unidades')
                .onDelete('CASCADE')
                .notNullable();
            table.timestamps(true);
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1744902509837_create_categorias_table.js.map