import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'relatorio_mensal_vendas';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.integer('mes').notNullable();
            table.integer('ano').notNullable();
            table
                .integer('unidade_id')
                .unsigned()
                .references('id')
                .inTable('unidades')
                .onDelete('CASCADE');
            table
                .integer('categoria_id')
                .unsigned()
                .references('id')
                .inTable('categorias')
                .onDelete('CASCADE');
            table.integer('total_vendas').notNullable();
            table.integer('total_itens_vendidos').notNullable();
            table.decimal('total_valor', 10, 2).notNullable();
            table.decimal('total_dinheiro', 10, 2).notNullable();
            table.decimal('total_cartao', 10, 2).notNullable();
            table.decimal('total_pix', 10, 2).notNullable();
            table.timestamps(true);
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1746195468807_create_relatorio_mensal_vendas_table.js.map