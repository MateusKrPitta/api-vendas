// app/models/relatorio_saida.ts
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class RelatorioSaida extends BaseModel {
  static table = 'relatorios_saidas'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'unidade_id' })
  declare unidadeId: number

  @column()
  declare ano: number

  @column()
  declare mes: number

  @column()
  declare dados: any

  @column({ columnName: 'total_valor' })
  declare totalValor: number

  @column({ columnName: 'total_saidas' })
  declare totalSaidas: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}