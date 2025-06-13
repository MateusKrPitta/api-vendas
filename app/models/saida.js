var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm';
import { DateTime } from 'luxon';
import Unidade from './unidade.js';
export default class Saida extends BaseModel {
    getDataSaidaJSDate() {
        return this.data_saida?.toJSDate() || null;
    }
    static boot() {
        if (this.booted)
            return;
        super.boot();
        this.before('create', (saida) => {
            if (!saida.data_saida) {
                saida.data_saida = DateTime.now();
            }
        });
    }
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], Saida.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Saida.prototype, "descricao", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Saida.prototype, "valor", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Saida.prototype, "forma_pagamento", void 0);
__decorate([
    column({ columnName: 'unidade_id' }),
    __metadata("design:type", Number)
], Saida.prototype, "unidadeId", void 0);
__decorate([
    column.dateTime({
        autoCreate: false,
        autoUpdate: false,
        serialize: (value) => value?.toISO() || null,
    }),
    __metadata("design:type", Object)
], Saida.prototype, "data_saida", void 0);
__decorate([
    belongsTo(() => Unidade),
    __metadata("design:type", Object)
], Saida.prototype, "unidade", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], Saida.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", DateTime)
], Saida.prototype, "updatedAt", void 0);
//# sourceMappingURL=saida.js.map