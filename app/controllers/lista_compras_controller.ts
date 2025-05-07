import { HttpContext } from '@adonisjs/core/http'
import ListaCompra from '#models/lista_compra'

export default class ListaComprasController {
  public async index({ response }: HttpContext) {
    const itens = await ListaCompra.all()
    return response.ok(itens)
  }

  public async store({ request, response }: HttpContext) {
    const data = request.only(['produto', 'quantidade'])

    if (!data.produto || !data.quantidade) {
      return response.badRequest({ message: 'Produto e quantidade são obrigatórios' })
    }

    const item = await ListaCompra.create(data)
    return response.created(item)
  }

  public async destroy({ params, response }: HttpContext) {
    const item = await ListaCompra.find(params.id)
    if (!item) {
      return response.notFound({ message: 'Item não encontrado' })
    }

    await item.delete()
    return response.ok({ message: 'Item removido com sucesso' })
  }
}
