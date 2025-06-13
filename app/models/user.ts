import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, belongsTo, manyToMany } from '@adonisjs/lucid/orm' // Adicione manyToMany aos imports
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { BelongsTo, ManyToMany } from '@adonisjs/lucid/types/relations' // Adicione ManyToMany

import Unidade from '#models/unidade'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column()
  declare ativo: boolean

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  // Opcional: mantenha se precisar de uma unidade principal
  @column()
  declare unidadeId: number | null

  @column()
  declare tipo: number

  // Relacionamento opcional (se manter unidadeId)
  @belongsTo(() => Unidade)
  declare unidade: BelongsTo<typeof Unidade>

  // Novo relacionamento many-to-many
  @manyToMany(() => Unidade, {
    pivotTable: 'user_unidades',
  })
  declare unidades: ManyToMany<typeof Unidade>

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '10 hours',
  })
}
