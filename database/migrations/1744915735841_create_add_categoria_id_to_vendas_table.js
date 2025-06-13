import { BaseSchema } from '@adonisjs/lucid/schema';
export default class AddCategoriaIdToVendas extends BaseSchema {
    tableName = 'vendas';
    async up() {
        this.schema.alterTable(this.tableName, (table) => {
            table
                .integer('categoria_id')
                .unsigned()
                .references('id')
                .inTable('categorias')
                .onDelete('SET NULL')
                .nullable();
        });
    }
    async down() {
        this.schema.alterTable(this.tableName, (table) => {
            table.dropColumn('categoria_id');
        });
    }
}
//# sourceMappingURL=1744915735841_create_add_categoria_id_to_vendas_table.js.map