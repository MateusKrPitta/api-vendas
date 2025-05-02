import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Fornecedor extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nome: string

  @column()
  declare telefone: string

  @column()
  declare observacao: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column()
  declare status: 'ativo' | 'inativo'

  @column.dateTime({ autoUpdate: true })
  declare updatedAt: DateTime

  // Adicione esta coluna para soft delete
  @column.dateTime({ autoCreate: false, autoUpdate: false })
  declare deletedAt: DateTime | null

  // Habilite o comportamento de soft delete
  static softDelete = true

  public static table = 'fornecedores'

}
