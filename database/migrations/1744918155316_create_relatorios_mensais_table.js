import { BaseSchema } from '@adonisjs/lucid/schema';
export default class RelatoriosSaidas extends BaseSchema {
    tableName = 'relatorios_saidas';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary();
            table.integer('unidade_id').unsigned().references('id').inTable('unidades').notNullable();
            table.integer('ano').notNullable();
            table.integer('mes').notNullable();
            table.json('dados').notNullable();
            table.float('total_valor').notNullable();
            table.integer('total_saidas').notNullable();
            table.unique(['unidade_id', 'ano', 'mes']);
            table.timestamps(true, true);
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1744918155316_create_relatorios_mensais_table.js.map