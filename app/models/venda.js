var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { DateTime } from 'luxon';
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm';
import Unidade from './unidade.js';
import Categoria from './categoria.js';
export default class Venda extends BaseModel {
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], Venda.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Venda.prototype, "nome", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Venda.prototype, "quantidade", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Venda.prototype, "valor", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Venda.prototype, "forma_pagamento", void 0);
__decorate([
    column.dateTime(),
    __metadata("design:type", DateTime)
], Venda.prototype, "data_venda", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Venda.prototype, "unidade_id", void 0);
__decorate([
    column(),
    __metadata("design:type", Number)
], Venda.prototype, "categoria_id", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], Venda.prototype, "createdAt", void 0);
__decorate([
    column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", DateTime)
], Venda.prototype, "updatedAt", void 0);
__decorate([
    belongsTo(() => Unidade, {
        foreignKey: 'unidade_id',
    }),
    __metadata("design:type", Object)
], Venda.prototype, "unidade", void 0);
__decorate([
    belongsTo(() => Categoria, {
        foreignKey: 'categoria_id',
    }),
    __metadata("design:type", Object)
], Venda.prototype, "categoria", void 0);
//# sourceMappingURL=venda.js.map