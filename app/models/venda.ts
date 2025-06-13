import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import Unidade from './unidade.js'
import Categoria from './categoria.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Venda extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nome: string

  @column()
  declare quantidade: number

  @column()
  declare valor: number

  @column()
  declare forma_pagamento: number

  @column.dateTime()
  declare data_venda: DateTime

  @column()
  declare unidade_id: number // Mantém o nome da coluna como está no banco

  @column()
  declare categoria_id: number // Mantém o nome da coluna como está no banco

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Unidade, {
    foreignKey: 'unidade_id', // Especifica explicitamente a chave estrangeira
  })
  declare unidade: BelongsTo<typeof Unidade>

  @belongsTo(() => Categoria, {
    foreignKey: 'categoria_id', // Especifica explicitamente a chave estrangeira
  })
  declare categoria: BelongsTo<typeof Categoria>
}
