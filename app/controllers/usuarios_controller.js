import User from '#models/user';
export default class UsuariosController {
    async index({ auth }) {
        await auth.use('api').authenticate();
        return await User.query().preload('unidades');
    }
    async ativos({ auth }) {
        await auth.use('api').authenticate();
        return await User.query().where('ativo', true).preload('unidades');
    }
    async inativos({ auth }) {
        await auth.use('api').authenticate();
        return await User.query().where('ativo', false).preload('unidades');
    }
    async show({ auth, params }) {
        await auth.use('api').authenticate();
        return await User.query().where('id', params.id).preload('unidades').firstOrFail();
    }
    async store({ auth, request, response }) {
        await auth.use('api').authenticate();
        const data = request.only(['fullName', 'email', 'password', 'tipo']);
        const unidadesIds = request.input('unidadesIds', []);
        try {
            const user = await User.create({
                ...data,
                ativo: true,
                unidadeId: null,
            });
            if (unidadesIds.length > 0) {
                await user.related('unidades').attach(unidadesIds);
            }
            await user.load('unidades');
            return user;
        }
        catch (error) {
            const err = error;
            if (err.code === '23505' && err.detail?.includes('users_email_unique')) {
                return response.status(400).json({ message: 'E-mail já cadastrado.' });
            }
            console.error(error);
            return response.status(500).json({ message: 'Erro ao criar usuário.' });
        }
    }
    async update({ auth, params, request, response }) {
        await auth.use('api').authenticate();
        const user = await User.findOrFail(params.id);
        const data = request.only(['fullName', 'email', 'tipo']);
        const unidadesIds = request.input('unidadesIds', undefined);
        if (data.email && data.email !== user.email) {
            const existingUser = await User.findBy('email', data.email);
            if (existingUser) {
                return response.status(400).json({ message: 'E-mail já está em uso' });
            }
        }
        user.merge(data);
        await user.save();
        if (unidadesIds !== undefined) {
            await user.related('unidades').sync(unidadesIds);
        }
        await user.load('unidades');
        return user;
    }
    async destroy({ auth, params, response }) {
        await auth.use('api').authenticate();
        const user = await User.findOrFail(params.id);
        user.ativo = false;
        await user.save();
        return response.status(200).json({ message: 'Usuário inativado com sucesso' });
    }
    async reativar({ auth, params, response }) {
        await auth.use('api').authenticate();
        const user = await User.findOrFail(params.id);
        user.ativo = true;
        await user.save();
        return response.status(200).json({ message: 'Usuário reativado com sucesso' });
    }
}
//# sourceMappingURL=usuarios_controller.js.map