import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'

export default class UsuariosController {
  public async index({ auth }: HttpContext) {
    await auth.use('api').authenticate()  // Verifica o token
    return await User.all()
  }

  public async ativos({ auth }: HttpContext) {
    await auth.use('api').authenticate()  // Verifica o token
    return await User.query().where('ativo', true)
  }

  public async inativos({ auth }: HttpContext) {
    await auth.use('api').authenticate()  // Verifica o token
    return await User.query().where('ativo', false)
  }

  public async show({ auth, params }: HttpContext) {
    await auth.use('api').authenticate()  // Verifica o token
    return await User.findOrFail(params.id)
  }

  public async store({ auth, request, response }: HttpContext) {
    await auth.use('api').authenticate()  // Verifica o token
    const data = request.only(['fullName', 'email', 'password', 'unidadeId', 'tipo'])
  
    try {
      const user = await User.create({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        unidadeId: data.unidadeId,
        tipo: data.tipo,
        ativo: true
      })
  
      return user
  
    } catch (error) {
      // Verifica erro de chave duplicada (PostgreSQL error code 23505)
      if (error.code === '23505' && error.detail?.includes('users_email_unique')) {
        return response.status(400).json({ message: 'E-mail já cadastrado.' })
      }
  
      // Outros erros não tratados
      console.error(error)
      return response.status(500).json({ message: 'Erro ao criar usuário.' })
    }
  }
  
// Atualize o método update no UsuariosController
public async update({ auth, params, request, response }: HttpContext) {
  await auth.use('api').authenticate()
  const user = await User.findOrFail(params.id)
  
  const data = request.only(['fullName', 'email', 'unidadeId', 'tipo'])
  
  // Verifica se email já existe em outro usuário
  if (data.email && data.email !== user.email) {
    const existingUser = await User.findBy('email', data.email)
    if (existingUser && existingUser.id !== user.id) {
      return response.status(400).json({ message: 'E-mail já está em uso' })
    }
  }
  
  // Atualiza apenas os campos que foram fornecidos
  user.merge(data)
  await user.save()
  
  return user
}
  public async destroy({ auth, params, response }: HttpContext) {
    await auth.use('api').authenticate()  // Verifica o token
    const user = await User.findOrFail(params.id)
    user.ativo = false
    await user.save()

    return response.status(200).json({ message: 'Usuário inativado com sucesso' })
  }

  public async reativar({ auth, params, response }: HttpContext) {
    await auth.use('api').authenticate()  // Verifica o token
    const user = await User.findOrFail(params.id)
    user.ativo = true
    await user.save()

    return response.status(200).json({ message: 'Usuário reativado com sucesso' })
  }
}
