import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class RelatorioMensalVenda extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare ano: number

  @column()
  declare mes: number

  @column({ columnName: 'unidade_id' })
  declare unidadeId: number

  @column({ columnName: 'categoria_id' })
  declare categoriaId: number

  @column()
  declare total_vendas: number

  @column()
  declare total_itens_vendidos: number

  @column()
  declare total_valor: number

  @column()
  declare total_dinheiro: number

  @column()
  declare total_cartao: number

  @column()
  declare total_pix: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
