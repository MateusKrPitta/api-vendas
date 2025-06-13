import Categoria from '#models/categoria';
import Unidade from '#models/unidade';
export default class CategoriasController {
    async store({ request, response }) {
        try {
            const data = request.only(['nome', 'unidade_id']);
            await Unidade.findOrFail(data.unidade_id);
            const categoria = await Categoria.create(data);
            return response.status(201).json({
                success: true,
                message: 'Categoria cadastrada com sucesso',
                data: categoria,
            });
        }
        catch (error) {
            return response.status(400).json({
                success: false,
                message: 'Erro ao cadastrar categoria',
                error: error.message,
            });
        }
    }
    async index({ request, response }) {
        try {
            const { unidade_id, inativos } = request.qs();
            const query = Categoria.query().where('unidade_id', unidade_id).preload('unidade');
            if (!inativos) {
                query.where('ativo', true);
            }
            const categorias = await query;
            return response.status(200).json({
                success: true,
                data: categorias,
            });
        }
        catch (error) {
            return response.status(400).json({
                success: false,
                message: 'Erro ao buscar categorias',
                error: error.message,
            });
        }
    }
    async update({ params, request, response }) {
        try {
            const categoria = await Categoria.findOrFail(params.id);
            const data = request.only(['nome', 'unidade_id']);
            categoria.merge(data);
            await categoria.save();
            return response.status(200).json({
                success: true,
                message: 'Categoria atualizada com sucesso',
                data: categoria,
            });
        }
        catch (error) {
            return response.status(400).json({
                success: false,
                message: 'Erro ao atualizar categoria',
                error: error.message,
            });
        }
    }
    async ativar({ params, response }) {
        try {
            const categoria = await Categoria.findOrFail(params.id);
            if (categoria.ativo) {
                return response.status(400).json({
                    success: false,
                    message: 'Categoria já está ativa',
                });
            }
            categoria.ativo = true;
            await categoria.save();
            return response.status(200).json({
                success: true,
                message: 'Categoria ativada com sucesso',
                data: categoria,
            });
        }
        catch (error) {
            return response.status(400).json({
                success: false,
                message: 'Erro ao ativar categoria',
                error: error.message,
            });
        }
    }
    async inativar({ params, response }) {
        try {
            const categoria = await Categoria.findOrFail(params.id);
            if (!categoria.ativo) {
                return response.status(400).json({
                    success: false,
                    message: 'Categoria já está inativa',
                });
            }
            categoria.ativo = false;
            await categoria.save();
            return response.status(200).json({
                success: true,
                message: 'Categoria inativada com sucesso',
                data: categoria,
            });
        }
        catch (error) {
            return response.status(400).json({
                success: false,
                message: 'Erro ao inativar categoria',
                error: error.message,
            });
        }
    }
}
//# sourceMappingURL=categorias_controller.js.map