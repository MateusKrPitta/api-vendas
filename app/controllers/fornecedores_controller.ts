import type { HttpContext } from '@adonisjs/core/http'
import Fornecedor from '#models/fornecedor'

export default class FornecedoresController {
  // Listar todos os fornecedores ativos
  public async index({ auth, response }: HttpContext) {
    try {
      await auth.use('api').authenticate()
      const fornecedores = await Fornecedor.query().where('status', 'ativo')
      return response.status(200).json({
        message: 'Fornecedores ativos listados com sucesso',
        data: fornecedores
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Erro ao listar fornecedores',
        error: error.message
      })
    }
  }

  // Criar um novo fornecedor (ativo por padrão)
  public async store({ auth, request, response }: HttpContext) {
    try {
      await auth.use('api').authenticate()
      const data = request.only(['nome', 'telefone', 'observacao'])

      const fornecedor = await Fornecedor.create({
        nome: data.nome,
        telefone: data.telefone,
        observacao: data.observacao || null,
        status: 'ativo'
      })
      
      return response.status(201).json({
        message: 'Fornecedor criado com sucesso',
        data: fornecedor
      })
    } catch (error) {
      return response.status(400).json({
        message: 'Erro ao criar fornecedor',
        error: error.message
      })
    }
  }

  // Mostrar um fornecedor específico (mesmo inativo)
  public async show({ auth, params, response }: HttpContext) {
    try {
      await auth.use('api').authenticate()
      const fornecedor = await Fornecedor.findOrFail(params.id)
      return response.status(200).json({
        message: 'Fornecedor encontrado com sucesso',
        data: fornecedor
      })
    } catch (error) {
      return response.status(404).json({
        message: 'Fornecedor não encontrado',
        error: error.message
      })
    }
  }

  // Atualizar fornecedor
  public async update({ auth, params, request, response }: HttpContext) {
    try {
      await auth.use('api').authenticate()
      const fornecedor = await Fornecedor.findOrFail(params.id)
      const data = request.only(['nome', 'telefone', 'observacao', 'status'])
      
      fornecedor.merge(data)
      await fornecedor.save()
      
      return response.status(200).json({
        message: 'Fornecedor atualizado com sucesso',
        data: fornecedor
      })
    } catch (error) {
      return response.status(400).json({
        message: 'Erro ao atualizar fornecedor',
        error: error.message
      })
    }
  }

  // Inativar fornecedor
  public async destroy({ auth, params, response }: HttpContext) {
    try {
      await auth.use('api').authenticate()
      const fornecedor = await Fornecedor.findOrFail(params.id)
      
      if (fornecedor.status === 'inativo') {
        return response.status(400).json({ 
          message: 'Fornecedor já está inativo',
          data: fornecedor
        })
      }
      
      fornecedor.status = 'inativo'
      await fornecedor.save()
      
      return response.status(200).json({ 
        message: 'Fornecedor inativado com sucesso',
        data: fornecedor
      })
    } catch (error) {
      return response.status(400).json({
        message: 'Erro ao inativar fornecedor',
        error: error.message
      })
    }
  }

  // Reativar fornecedor
  public async reativar({ auth, params, response }: HttpContext) {
    try {
      await auth.use('api').authenticate()
      const fornecedor = await Fornecedor.findOrFail(params.id)
      
      if (fornecedor.status === 'ativo') {
        return response.status(400).json({ 
          message: 'Fornecedor já está ativo',
          data: fornecedor
        })
      }
      
      fornecedor.status = 'ativo'
      await fornecedor.save()
      
      return response.status(200).json({ 
        message: 'Fornecedor reativado com sucesso',
        data: fornecedor
      })
    } catch (error) {
      return response.status(400).json({
        message: 'Erro ao reativar fornecedor',
        error: error.message
      })
    }
  }
}