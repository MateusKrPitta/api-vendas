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
import { BaseModel, column } from '@adonisjs/lucid/orm';
export default class Fornecedor extends BaseModel {
    static softDelete = true;
    static table = 'fornecedores';
}
__decorate([
    column({ isPrimary: true }),
    __metadata("design:type", Number)
], Fornecedor.prototype, "id", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Fornecedor.prototype, "nome", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Fornecedor.prototype, "telefone", void 0);
__decorate([
    column(),
    __metadata("design:type", Object)
], Fornecedor.prototype, "observacao", void 0);
__decorate([
    column.dateTime({ autoCreate: true }),
    __metadata("design:type", DateTime)
], Fornecedor.prototype, "createdAt", void 0);
__decorate([
    column(),
    __metadata("design:type", String)
], Fornecedor.prototype, "status", void 0);
__decorate([
    column.dateTime({ autoUpdate: true }),
    __metadata("design:type", DateTime)
], Fornecedor.prototype, "updatedAt", void 0);
__decorate([
    column.dateTime({ autoCreate: false, autoUpdate: false }),
    __metadata("design:type", Object)
], Fornecedor.prototype, "deletedAt", void 0);
//# sourceMappingURL=fornecedor.js.map