// app/models/saida.ts
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Unidade from './unidade.js'

export default class Saida extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare descricao: string

  @column()
  declare valor: number

  @column()
  declare forma_pagamento: number

  @column({ columnName: 'unidade_id' })
  declare unidadeId: number

  // Data de saída (pode ser null)
  @column.dateTime({
    autoCreate: false,
    autoUpdate: false,
    serialize: (value: DateTime | null) => value?.toISO() || null,
  })
  declare data_saida: DateTime | null

  // Relacionamento com Unidade
  @belongsTo(() => Unidade)
  declare unidade: BelongsTo<typeof Unidade>

  // Data de criação
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  // Data de atualização
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /**
   * Método seguro para obter data_saida como JavaScript Date
   * Retorna null se data_saida for null
   */
  public getDataSaidaJSDate(): Date | null {
    return this.data_saida?.toJSDate() || null
  }

  /**
   * Hook para garantir que data_saida tenha um valor padrão ao criar
   */
  static boot() {
    if (this.booted) return

    super.boot()

    this.before('create', (saida: Saida) => {
      if (!saida.data_saida) {
        saida.data_saida = DateTime.now()
      }
    })
  }
}
