import User from '#models/user';
import hash from '@adonisjs/core/services/hash';
export default class AuthController {
    async login({ auth, request, response }) {
        const { email, password } = request.only(['email', 'password']);
        try {
            const user = await User.query()
                .where('email', email)
                .preload('unidades')
                .first();
            if (!user) {
                return response.unauthorized({
                    status: false,
                    message: 'Email não encontrado',
                    data: null,
                });
            }
            if (!(await hash.verify(user.password, password))) {
                return response.unauthorized({
                    status: false,
                    message: 'Senha incorreta',
                    data: null,
                });
            }
            if (!user.ativo) {
                return response.unauthorized({
                    status: false,
                    message: 'Conta desativada',
                    data: null,
                });
            }
            const token = await auth.use('api').createToken(user);
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
                        unidades: user.unidades?.map((u) => ({
                            id: u.id,
                            nome: u.nome,
                        })) || [],
                    },
                },
            });
        }
        catch (error) {
            return response.status(500).json({
                status: false,
                message: 'Erro durante o login',
                error: error.message,
            });
        }
    }
}
//# sourceMappingURL=auth_controller.js.map