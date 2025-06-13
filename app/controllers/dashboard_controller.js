import Dashboard from '#models/dashboard';
import Unidade from '#models/unidade';
import Venda from '#models/venda';
import Saida from '#models/saida';
import { DateTime } from 'luxon';
export default class DashboardsController {
    async show({ params, response }) {
        const { unidadeId } = params;
        try {
            const unidade = await Unidade.find(unidadeId);
            if (!unidade) {
                return response.status(404).json({
                    success: false,
                    message: 'Unidade não encontrada',
                });
            }
            const dashboardData = await this._calcularDadosDashboard(unidadeId);
            return response.status(200).json({
                success: true,
                message: 'Dados do dashboard recuperados com sucesso',
                data: dashboardData,
            });
        }
        catch (error) {
            return response.status(500).json({
                success: false,
                message: 'Erro ao calcular dados do dashboard',
                error: error.message,
            });
        }
    }
    async _calcularDadosDashboard(unidadeId) {
        const now = DateTime.now();
        const startOfMonth = now.startOf('month');
        const endOfMonth = now.endOf('month');
        const vendasMes = await Venda.query()
            .where('unidade_id', unidadeId)
            .where('data_venda', '>=', startOfMonth.toJSDate())
            .where('data_venda', '<=', endOfMonth.toJSDate())
            .preload('categoria');
        const totalQuantidadeProdutos = vendasMes.reduce((sum, venda) => sum + venda.quantidade, 0);
        const valorTotalVendas = vendasMes.reduce((sum, venda) => sum + venda.valor, 0);
        const categoriasCount = await Venda.query()
            .where('unidade_id', unidadeId)
            .countDistinct('categoria_id as total')
            .first();
        const quantidadeCategorias = Number(categoriasCount?.$extras.total || 0);
        const categoriasComQuantidade = await Venda.query()
            .where('vendas.unidade_id', unidadeId)
            .where('data_venda', '>=', startOfMonth.toJSDate())
            .where('data_venda', '<=', endOfMonth.toJSDate())
            .join('categorias', 'vendas.categoria_id', '=', 'categorias.id')
            .groupBy('categorias.id', 'categorias.nome')
            .select('categorias.id', 'categorias.nome')
            .sum('vendas.quantidade as total_quantidade')
            .sum('vendas.valor as total_valor')
            .orderBy('total_quantidade', 'desc');
        const categoriasMaisVendidas = categoriasComQuantidade.slice(0, 5);
        const saidasMes = await Saida.query()
            .where('unidade_id', unidadeId)
            .where('data_saida', '>=', startOfMonth.toJSDate())
            .where('data_saida', '<=', endOfMonth.toJSDate());
        const valorTotalSaidas = saidasMes.reduce((sum, saida) => sum + saida.valor, 0);
        return {
            unidadeId,
            total_quantidade_produtos: totalQuantidadeProdutos,
            valor_total_vendas: valorTotalVendas,
            valor_total_saidas: valorTotalSaidas,
            quantidade_categorias: quantidadeCategorias,
            categorias: categoriasComQuantidade.map((cat) => ({
                id: cat.id,
                nome: cat.nome,
                quantidade: cat.$extras.total_quantidade,
                valor_total: cat.$extras.total_valor,
            })),
            categorias_mais_vendidas: categoriasMaisVendidas.map((cat) => ({
                id: cat.id,
                nome: cat.nome,
                quantidade: cat.$extras.total_quantidade,
                valor_total: cat.$extras.total_valor,
            })),
        };
    }
    async atualizar({ params, response }) {
        const { unidadeId } = params;
        try {
            const dados = await this._calcularDadosDashboard(unidadeId);
            const dashboard = await Dashboard.updateOrCreate({ unidadeId }, {
                totalQuantidadeProdutos: dados.total_quantidade_produtos,
                valorTotalVendas: dados.valor_total_vendas,
                valorTotalSaidas: dados.valor_total_saidas,
                quantidadeCategorias: dados.quantidade_categorias,
                categoriasMaisVendidas: dados.categorias_mais_vendidas,
                categoriasComQuantidade: dados.categorias,
            });
            return response.status(200).json({
                success: true,
                message: 'Dashboard atualizado com sucesso',
                data: dashboard,
            });
        }
        catch (error) {
            return response.status(500).json({
                success: false,
                message: 'Erro ao atualizar dashboard',
                error: error.message,
            });
        }
    }
}
//# sourceMappingURL=dashboard_controller.js.map