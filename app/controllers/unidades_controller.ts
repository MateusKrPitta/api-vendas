import type { HttpContext } from '@adonisjs/core/http'
import Unidade from '#models/unidade'

export default class UnidadesController {
  public async index({ auth }: HttpContext) {
    await auth.use('api').authenticate() 
    return await Unidade.all()
  }

  public async store({ auth, request, response }: HttpContext) {
    await auth.use('api').authenticate()
    const data = request.only(['nome'])
  
    try {
      const unidade = await Unidade.create(data)
      return response.status(201).json({
        message: 'Unidade criada com sucesso',
        data: unidade,
      })
    } catch (error) {
      if (error.code === '23505') { // Código de erro do PostgreSQL para chave duplicada
        return response.status(400).json({
          message: 'Já existe uma unidade com esse nome.',
        })
      }
  
      return response.status(500).json({
        message: 'Erro ao criar unidade.',
        error: error.message,
      })
    }
  }
  

  public async show({ auth, params }: HttpContext) {
    await auth.use('api').authenticate()  // Verifica o token
    return await Unidade.findOrFail(params.id)
  }

  public async update({ auth, params, request }: HttpContext) {
    await auth.use('api').authenticate()  // Verifica o token
    const unidade = await Unidade.findOrFail(params.id)
    const data = request.only(['nome'])
    unidade.merge(data)
    await unidade.save()
    return unidade
  }

  public async destroy({ auth, params, response }: HttpContext) {
    await auth.use('api').authenticate()  // Verifica o token
    const unidade = await Unidade.findOrFail(params.id)
    unidade.ativo = false
    await unidade.save()

    return response.status(200).json({ message: 'Unidade inativada com sucesso' })
  }

  public async inativas({ auth }: HttpContext) {
    await auth.use('api').authenticate()  // Verifica o token
    return await Unidade.query().where('ativo', false)
  }
  
  public async reativar({ auth, params, response }: HttpContext) {
    await auth.use('api').authenticate()
  
    try {
      const unidade = await Unidade.query()
        .where('id', params.id)
        .andWhere('ativo', false)
        .firstOrFail()
  
      unidade.ativo = true
      await unidade.save()
  
      return response.status(200).json({
        message: 'Unidade reativada com sucesso',
        data: unidade
      })
    } catch (error) {
      return response.status(404).json({
        message: 'Unidade não encontrada ou já está ativa'
      })
    }
  }
  
}
