import Unidade from '#models/unidade';
export default class UnidadesController {
    async index({ auth }) {
        await auth.use('api').authenticate();
        return await Unidade.all();
    }
    async store({ auth, request, response }) {
        await auth.use('api').authenticate();
        const data = request.only(['nome']);
        try {
            const unidade = await Unidade.create(data);
            return response.status(201).json({
                message: 'Unidade criada com sucesso',
                data: unidade,
            });
        }
        catch (error) {
            const err = error;
            if (err.code === '23505') {
                return response.status(400).json({
                    message: 'Já existe uma unidade com esse nome.',
                });
            }
            return response.status(500).json({
                message: 'Erro ao criar unidade.',
                error: error.message,
            });
        }
    }
    async show({ auth, params }) {
        await auth.use('api').authenticate();
        return await Unidade.findOrFail(params.id);
    }
    async update({ auth, params, request }) {
        await auth.use('api').authenticate();
        const unidade = await Unidade.findOrFail(params.id);
        const data = request.only(['nome']);
        unidade.merge(data);
        await unidade.save();
        return unidade;
    }
    async destroy({ auth, params, response }) {
        await auth.use('api').authenticate();
        const unidade = await Unidade.findOrFail(params.id);
        unidade.ativo = false;
        await unidade.save();
        return response.status(200).json({ message: 'Unidade inativada com sucesso' });
    }
    async inativas({ auth }) {
        await auth.use('api').authenticate();
        return await Unidade.query().where('ativo', false);
    }
    async reativar({ auth, params, response }) {
        await auth.use('api').authenticate();
        try {
            const unidade = await Unidade.query()
                .where('id', params.id)
                .andWhere('ativo', false)
                .firstOrFail();
            unidade.ativo = true;
            await unidade.save();
            return response.status(200).json({
                message: 'Unidade reativada com sucesso',
                data: unidade,
            });
        }
        catch (error) {
            return response.status(404).json({
                message: 'Unidade não encontrada ou já está ativa',
            });
        }
    }
}
//# sourceMappingURL=unidades_controller.js.map