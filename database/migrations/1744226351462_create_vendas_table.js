import { BaseSchema } from '@adonisjs/lucid/schema';
export default class Vendas extends BaseSchema {
    tableName = 'vendas';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary();
            table.string('nome');
            table.integer('quantidade');
            table.float('valor');
            table.integer('forma_pagamento');
            table.integer('unidade_id').unsigned().references('id').inTable('unidades');
            table.timestamp('data_venda');
            table.timestamps();
        });
    }
    async down() {
        this.schema.dropTableIfExists(this.tableName);
    }
}
//# sourceMappingURL=1744226351462_create_vendas_table.js.map