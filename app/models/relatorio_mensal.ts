// app/models/relatorio_saida.ts
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class RelatorioSaida extends BaseModel {
  static table = 'relatorios_saidas'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'unidade_id' }) // Mapeia para snake_case no banco
  declare unidadeId: number // camelCase no código

  @column()
  declare ano: number

  @column()
  declare mes: number

  @column()
  declare dados: any

  @column()
  declare total_valor: number

  @column()
  declare total_saidas: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}