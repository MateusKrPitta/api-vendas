// app/models/dashboard.ts
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import Unidade from '#models/unidade'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Dashboard extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare unidadeId: number

  @column()
  declare totalQuantidadeProdutos: number

  @column()
  declare valorTotalVendas: number

  @column()
  declare valorTotalSaidas: number

  @column()
  declare quantidadeCategorias: number

  @column()
  declare categoriasMaisVendidas: any // JSON com as top 5 categorias

  @column()
  declare categoriasComQuantidade: any // JSON com todas as categorias e quantidades

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Unidade)
  declare unidade: BelongsTo<typeof Unidade>
}
