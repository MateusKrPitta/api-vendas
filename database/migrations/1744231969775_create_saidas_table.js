import { BaseSchema } from '@adonisjs/lucid/schema';
export default class Saidas extends BaseSchema {
    tableName = 'saidas';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary();
            table.string('descricao').notNullable();
            table.float('valor').notNullable();
            table.integer('forma_pagamento').notNullable();
            table.integer('unidade_id').unsigned().references('id').inTable('unidades');
            table.timestamp('data_saida');
            table.timestamps(true, true);
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1744231969775_create_saidas_table.js.map