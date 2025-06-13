import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UsuariosController {
  public async index({ auth }: HttpContext) {
    await auth.use('api').authenticate()
    return await User.query().preload('unidades')
  }

  public async ativos({ auth }: HttpContext) {
    await auth.use('api').authenticate()
    return await User.query().where('ativo', true).preload('unidades')
  }

  public async inativos({ auth }: HttpContext) {
    await auth.use('api').authenticate()
    return await User.query().where('ativo', false).preload('unidades')
  }

  public async show({ auth, params }: HttpContext) {
    await auth.use('api').authenticate()
    return await User.query().where('id', params.id).preload('unidades').firstOrFail()
  }

  public async store({ auth, request, response }: HttpContext) {
    await auth.use('api').authenticate()
    const data = request.only(['fullName', 'email', 'password', 'tipo'])
    const unidadesIds = request.input('unidadesIds', []) // Agora recebe um array

    try {
      const user = await User.create({
        ...data,
        ativo: true,
        unidadeId: null, // Opcional ou mantenha para compatibilidade
      })

      // Associa as unidades
      if (unidadesIds.length > 0) {
        await user.related('unidades').attach(unidadesIds)
      }

      // Recarrega o usuário com as unidades para retornar
      await user.load('unidades')
      return user
    } catch (error) {
      const err = error as any
      if (err.code === '23505' && err.detail?.includes('users_email_unique')) {
        return response.status(400).json({ message: 'E-mail já cadastrado.' })
      }
      console.error(error)
      return response.status(500).json({ message: 'Erro ao criar usuário.' })
    }
  }

  public async update({ auth, params, request, response }: HttpContext) {
    await auth.use('api').authenticate()
    const user = await User.findOrFail(params.id)
    const data = request.only(['fullName', 'email', 'tipo'])
    const unidadesIds = request.input('unidadesIds', undefined) // undefined = não atualiza

    // Verifica e-mail
    if (data.email && data.email !== user.email) {
      const existingUser = await User.findBy('email', data.email)
      if (existingUser) {
        return response.status(400).json({ message: 'E-mail já está em uso' })
      }
    }

    // Atualiza dados básicos
    user.merge(data)
    await user.save()

    // Atualiza unidades (se enviado no request)
    if (unidadesIds !== undefined) {
      await user.related('unidades').sync(unidadesIds)
    }

    // Recarrega com as unidades atualizadas
    await user.load('unidades')
    return user
  }

  public async destroy({ auth, params, response }: HttpContext) {
    await auth.use('api').authenticate()
    const user = await User.findOrFail(params.id)
    user.ativo = false
    await user.save()

    return response.status(200).json({ message: 'Usuário inativado com sucesso' })
  }

  public async reativar({ auth, params, response }: HttpContext) {
    await auth.use('api').authenticate()
    const user = await User.findOrFail(params.id)
    user.ativo = true
    await user.save()

    return response.status(200).json({ message: 'Usuário reativado com sucesso' })
  }
}
