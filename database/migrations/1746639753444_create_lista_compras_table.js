import { BaseSchema } from '@adonisjs/lucid/schema';
export default class ListaCompras extends BaseSchema {
    tableName = 'lista_compras';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.string('produto').notNullable();
            table.integer('quantidade').unsigned().notNullable();
            table.timestamps(true);
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1746639753444_create_lista_compras_table.js.map