import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class AuthController {
  async login({ auth, request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
      // Carrega o usuário com as unidades relacionadas
      const user = await User.query()
        .where('email', email)
        .preload('unidades') // ← Esta linha é crucial
        .first()

      if (!user) {
        return response.unauthorized({
          status: false,
          message: 'Email não encontrado',
          data: null,
        })
      }

      // Verifica a senha
      if (!(await hash.verify(user.password, password))) {
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
            unidades: user.unidades?.map(u => ({ // ← Usando operador opcional
              id: u.id,
              nome: u.nome
            })) || [] // ← Fallback para array vazio
          },
        },
      })

    } catch (error) {
      return response.status(500).json({
        status: false,
        message: 'Erro durante o login',
        error: error.message
      })
    }
  }
}