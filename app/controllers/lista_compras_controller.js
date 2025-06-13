import ListaCompra from '#models/lista_compra';
export default class ListaComprasController {
    async index({ response }) {
        const itens = await ListaCompra.all();
        return response.ok(itens);
    }
    async store({ request, response }) {
        const data = request.only(['produto', 'quantidade']);
        if (!data.produto || !data.quantidade) {
            return response.badRequest({ message: 'Produto e quantidade são obrigatórios' });
        }
        const item = await ListaCompra.create(data);
        return response.created(item);
    }
    async destroy({ params, response }) {
        const item = await ListaCompra.find(params.id);
        if (!item) {
            return response.notFound({ message: 'Item não encontrado' });
        }
        await item.delete();
        return response.ok({ message: 'Item removido com sucesso' });
    }
}
//# sourceMappingURL=lista_compras_controller.js.map