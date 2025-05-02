import type { HttpContext } from '@adonisjs/core/http'
import Fornecedor from '#models/fornecedor'

export default class FornecedoresController {
  // Listar todos os fornecedores ativos
  public async index({ auth }: HttpContext) {
    await auth.use('api').authenticate()
    return await Fornecedor.query().where('status', 'ativo')
  }

  // Criar um novo fornecedor (ativo por padrão)
  public async store({ auth, request }: HttpContext) {
    await auth.use('api').authenticate()
    const data = request.only(['nome', 'telefone', 'observacao'])

    const fornecedor = await Fornecedor.create({
      nome: data.nome,
      telefone: data.telefone,
      observacao: data.observacao || null,
      status: 'ativo' // Definir como ativo por padrão
    })
    
    return fornecedor
  }

  // Mostrar um fornecedor específico (mesmo inativo)
  public async show({ auth, params }: HttpContext) {
    await auth.use('api').authenticate()
    return await Fornecedor.findOrFail(params.id)
  }

  // Atualizar fornecedor
  public async update({ auth, params, request }: HttpContext) {
    await auth.use('api').authenticate()
    const fornecedor = await Fornecedor.findOrFail(params.id)
    const data = request.only(['nome', 'telefone', 'observacao', 'status'])
    fornecedor.merge(data)
    await fornecedor.save()
    return fornecedor
  }

  // Inativar fornecedor
  public async destroy({ auth, params, response }: HttpContext) {
    await auth.use('api').authenticate();
    const fornecedor = await Fornecedor.findOrFail(params.id);
    
    if (fornecedor.status === 'inativo') {
      return response.status(400).json({ message: 'Fornecedor já está inativo' });
    }
    
    fornecedor.status = 'inativo';
    await fornecedor.save();
    
    return response.status(200).json({ 
      message: 'Fornecedor inativado com sucesso',
      fornecedor
    });
  }

  // Reativar fornecedor
  public async reativar({ auth, params, response }: HttpContext) {
    await auth.use('api').authenticate()
    const fornecedor = await Fornecedor.findOrFail(params.id)
    
    if (fornecedor.status === 'ativo') {
      return response.status(400).json({ message: 'Fornecedor já está ativo' })
    }
    
    fornecedor.status = 'ativo'
    await fornecedor.save()
    
    return response.status(200).json({ 
      message: 'Fornecedor reativado com sucesso',
      fornecedor
    })
  }
}