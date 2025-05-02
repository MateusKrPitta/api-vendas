import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class AuthController {
  async login({ auth, request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    // Verifica se o usuário existe
    const user = await User.findBy('email', email)
    if (!user) {
      return response.unauthorized({
        status: false,
        message: 'Email não encontrado',
        data: null,
      })
    }

    // Verifica a senha
    const isPasswordValid = await hash.verify(user.password, password)
    if (!isPasswordValid) {
      return response.unauthorized({
        status: false,
        message: 'Senha incorreta',
        data: null,
      })
    }

    // Verifica se está ativo
    if (!user.ativo) {
      return response.unauthorized({
        status: false,
        message: 'Conta desativada',
        data: null,
      })
    }

    // Gera o token
    const token = await auth.use('api').createToken(user)

    return response.ok({
      status: true,
      message: `Login realizado com sucesso. Bem-vindo, ${user.fullName}`,
      data: {
        token: token,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          tipo: user.tipo,
          unidadeId: user.unidadeId,
        },
      },
    })
  }
}
