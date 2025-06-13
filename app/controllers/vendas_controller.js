import Venda from '#models/venda';
import { DateTime } from 'luxon';
export default class VendasController {
    async vendasPorDia({ request, response }) {
        try {
            const { data, unidadeId } = request.only(['data', 'unidadeId']);
            const formattedDate = DateTime.fromISO(data).toFormat('yyyy-MM-dd');
            const query = Venda.query()
                .whereRaw('DATE(data_venda) = ?', [formattedDate])
                .preload('unidade')
                .preload('categoria');
            if (unidadeId) {
                query.where('unidade_id', unidadeId);
            }
            const vendas = await query;
            return response.status(200).json({
                success: true,
                message: 'Vendas recuperadas com sucesso',
                data: {
                    data: formattedDate,
                    unidadeId: unidadeId || null,
                    vendas: vendas.map((venda) => ({
                        id: venda.id,
                        nome: venda.nome,
                        quantidade: venda.quantidade,
                        valor: venda.valor,
                        forma_pagamento: venda.forma_pagamento,
                        data_venda: venda.data_venda,
                        unidade: venda.unidade,
                        categoria: venda.categoria,
                    })),
                },
            });
        }
        catch (error) {
            return response.status(500).json({
                success: false,
                message: 'Erro ao buscar vendas',
                error: error.message,
            });
        }
    }
    async store({ request, response }) {
        try {
            const data = request.only([
                'nome',
                'quantidade',
                'valor',
                'forma_pagamento',
                'unidade_id',
                'categoria_id',
            ]);
            data.data_venda = DateTime.local();
            const venda = await Venda.create(data);
            await venda.load('unidade');
            await venda.load('categoria');
            return response.status(201).json({
                success: true,
                message: 'Venda cadastrada com sucesso',
                data: {
                    id: venda.id,
                    nome: venda.nome,
                    quantidade: venda.quantidade,
                    valor: venda.valor,
                    forma_pagamento: venda.forma_pagamento,
                    data_venda: venda.data_venda,
                    unidade: venda.unidade,
                    categoria: venda.categoria,
                },
            });
        }
        catch (error) {
            return response.status(400).json({
                success: false,
                message: 'Erro ao cadastrar venda',
                error: error.message,
            });
        }
    }
    async show({ params, response }) {
        try {
            const venda = await Venda.query()
                .where('id', params.id)
                .preload('unidade')
                .preload('categoria')
                .firstOrFail();
            return response.status(200).json({
                success: true,
                message: 'Venda encontrada',
                data: {
                    id: venda.id,
                    nome: venda.nome,
                    quantidade: venda.quantidade,
                    valor: venda.valor,
                    forma_pagamento: venda.forma_pagamento,
                    data_venda: venda.data_venda,
                    unidade: venda.unidade,
                    categoria: venda.categoria,
                },
            });
        }
        catch (error) {
            return response.status(404).json({
                success: false,
                message: 'Venda não encontrada',
                error: error.message,
            });
        }
    }
    async update({ params, request, response }) {
        try {
            const venda = await Venda.findOrFail(params.id);
            const data = request.only([
                'nome',
                'quantidade',
                'valor',
                'forma_pagamento',
                'data_venda',
                'categoria_id',
                'unidade_id',
            ]);
            if (data.data_venda) {
                data.data_venda = DateTime.fromISO(data.data_venda);
            }
            venda.merge(data);
            await venda.save();
            await venda.load('unidade');
            await venda.load('categoria');
            return response.status(200).json({
                success: true,
                message: 'Venda atualizada com sucesso',
                data: {
                    id: venda.id,
                    nome: venda.nome,
                    quantidade: venda.quantidade,
                    valor: venda.valor,
                    forma_pagamento: venda.forma_pagamento,
                    data_venda: venda.data_venda,
                    unidade: venda.unidade,
                    categoria: venda.categoria,
                },
            });
        }
        catch (error) {
            return response.status(400).json({
                success: false,
                message: 'Erro ao atualizar venda',
                error: error.message,
            });
        }
    }
    async destroy({ params, response }) {
        try {
            const venda = await Venda.findOrFail(params.id);
            await venda.delete();
            return response.status(200).json({
                success: true,
                message: 'Venda removida com sucesso',
            });
        }
        catch (error) {
            return response.status(400).json({
                success: false,
                message: 'Erro ao remover venda',
                error: error.message,
            });
        }
    }
    async storeWithCustomDate({ request, response }) {
        try {
            const payload = request.only([
                'nome',
                'quantidade',
                'valor',
                'forma_pagamento',
                'unidade_id',
                'categoria_id',
                'data_venda',
            ]);
            const venda = await Venda.create(payload);
            await venda.load('unidade');
            await venda.load('categoria');
            return response.status(201).json({
                success: true,
                message: 'Venda com data customizada cadastrada com sucesso',
                data: {
                    id: venda.id,
                    nome: venda.nome,
                    quantidade: venda.quantidade,
                    valor: venda.valor,
                    forma_pagamento: venda.forma_pagamento,
                    data_venda: venda.data_venda,
                    unidade: venda.unidade,
                    categoria: venda.categoria,
                },
            });
        }
        catch (error) {
            return response.status(400).json({
                success: false,
                message: 'Erro ao cadastrar venda com data customizada',
                error: error.message,
            });
        }
    }
    async vendasPorUnidade({ request, response }) {
        try {
            const { unidadeId } = request.only(['unidadeId']);
            if (!unidadeId) {
                return response.status(400).json({
                    success: false,
                    message: 'O parâmetro unidadeId é obrigatório',
                });
            }
            const vendas = await Venda.query()
                .where('unidade_id', unidadeId)
                .preload('unidade')
                .preload('categoria')
                .orderBy('data_venda', 'desc');
            return response.status(200).json({
                success: true,
                message: 'Vendas por unidade recuperadas com sucesso',
                data: vendas.map((venda) => ({
                    id: venda.id,
                    produto: venda.nome,
                    quantidade: venda.quantidade,
                    valor: venda.valor,
                    formaPagamento: venda.forma_pagamento,
                    data_venda: venda.data_venda,
                    unidade: {
                        id: venda.unidade.id,
                        nome: venda.unidade.nome,
                    },
                    categoria: {
                        id: venda.categoria.id,
                        nome: venda.categoria.nome,
                    },
                })),
            });
        }
        catch (error) {
            return response.status(500).json({
                success: false,
                message: 'Erro ao buscar vendas por unidade',
                error: error.message,
            });
        }
    }
}
//# sourceMappingURL=vendas_controller.js.map