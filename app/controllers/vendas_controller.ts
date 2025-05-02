import { HttpContext } from '@adonisjs/core/http'
import Venda from '#models/venda'
import { DateTime } from 'luxon'

interface VendaData {
  nome: string
  quantidade: number
  valor: number
  forma_pagamento: number
  categoria_id: number
  unidade_id: number
  data_venda: DateTime
}

export default class VendasController {
  public async vendasPorDia({ request, response }: HttpContext) {
    try {
      const { data } = request.only(['data'])
      const formattedDate = DateTime.fromISO(data).toFormat('yyyy-MM-dd')

      const vendas = await Venda.query()
        .whereRaw('DATE(data_venda) = ?', [formattedDate])
        .preload('unidade')
        .preload('categoria')

      const vendasPorData = {
        data: formattedDate,
        vendas: vendas.map(venda => ({
          id: venda.id,
          produto: venda.nome,
          quantidade: venda.quantidade,
          valor: venda.valor,
          formaPagamento: venda.forma_pagamento,
          unidade: {
            id: venda.unidade.id,
            nome: venda.unidade.nome
          },
          categoria: {
            id: venda.categoria.id,
            nome: venda.categoria.nome
          }
        }))
      }

      return response.status(200).json({
        success: true,
        message: 'Vendas recuperadas com sucesso',
        data: vendasPorData
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Erro ao buscar vendas',
        error: error.message
      })
    }
  }

  public async store({ request, response }: HttpContext) {
    try {
      const data = request.only([
        'nome', 
        'quantidade', 
        'valor', 
        'forma_pagamento', 
        'unidade_id',
        'categoria_id'
      ]) as VendaData

      data.data_venda = DateTime.local()

      const venda = await Venda.create(data)
      
      // Carrega os relacionamentos com unidade e categoria
      await venda.load('unidade')
      await venda.load('categoria')

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
          categoria: venda.categoria
        }
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Erro ao cadastrar venda',
        error: error.message
      })
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const venda = await Venda.query()
        .where('id', params.id)
        .preload('unidade')
        .preload('categoria')
        .firstOrFail()

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
          categoria: venda.categoria
        }
      })
    } catch (error) {
      return response.status(404).json({
        success: false,
        message: 'Venda não encontrada',
        error: error.message
      })
    }
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      const venda = await Venda.findOrFail(params.id)
      const data = request.only([
        'nome',
        'quantidade',
        'valor',
        'forma_pagamento',
        'data_venda',
        'categoria_id',
        'unidade_id'
      ])
      
      if (data.data_venda) {
        data.data_venda = DateTime.fromISO(data.data_venda)
      }
      
      venda.merge(data)
      await venda.save()

      // Carrega os relacionamentos atualizados
      await venda.load('unidade')
      await venda.load('categoria')

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
          categoria: venda.categoria
        }
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Erro ao atualizar venda',
        error: error.message
      })
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const venda = await Venda.findOrFail(params.id)
      await venda.delete()

      return response.status(200).json({
        success: true,
        message: 'Venda removida com sucesso'
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Erro ao remover venda',
        error: error.message
      })
    }
  }
}