import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import Unidade from './unidade.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Categoria extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nome: string

  @column()
  declare unidadeId: number

  @column()
  public ativo: boolean = true 

  @belongsTo(() => Unidade)
  public unidade!: BelongsTo<typeof Unidade>

}
