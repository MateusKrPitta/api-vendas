// app/controllers/saidas_controller.ts
import { HttpContext } from '@adonisjs/core/http'
import Saida from '#models/saida'
import { DateTime } from 'luxon'
import Unidade from '#models/unidade'

interface SaidaData {
  descricao: string
  valor: number
  forma_pagamento: number
  unidade_id: number
  data_saida?: DateTime
}

interface SaidaComUnidade {
  id: number
  descricao: string
  valor: number
  unidade_id: number
  unidade?: Unidade
  forma_pagamento: number
  data_registro: string | null // Permite null
}

interface SaidasPorData {
  [key: string]: SaidaComUnidade[]
}

export default class SaidasController {
  public async index({ request }: HttpContext) {
    const { data } = request.only(['data'])
  
    // 1. Criar query base
    const query = Saida.query()
      .preload('unidade')
      .orderBy('data_saida', 'desc')
  
    // 2. Filtrar por data se fornecida
    if (data) {
      try {
        const parsedDate = DateTime.fromISO(data)
        if (!parsedDate.isValid) {
          throw new Error('Data inválida')
        }
        const inicioDoDia = parsedDate.startOf('day').toISO()
        const fimDoDia = parsedDate.endOf('day').toISO()
        
        query.whereBetween('data_saida', [inicioDoDia, fimDoDia])
        

      } catch (error) {
        throw new Error('Formato de data inválido. Use YYYY-MM-DD')
      }
    }
  
    // 3. Executar query e processar resultados
    const saidas = await query.exec()
  
    const resultado = saidas.reduce((acc: SaidasPorData, saida) => {
      const dataSaida = saida.data_saida || saida.createdAt
      const dataKey = dataSaida?.isValid ? dataSaida.toFormat('dd-MM-yyyy') : 'Data inválida'
    
      if (!acc[dataKey]) {
        acc[dataKey] = []
      }
    
      acc[dataKey].push({
        id: saida.id,
        descricao: saida.descricao,
        valor: saida.valor,
        unidade_id: saida.unidadeId,
        unidade: saida.unidade,
        forma_pagamento: saida.forma_pagamento,
        data_registro: dataSaida?.toISO() ?? null
      })
    
      return acc
    }, {} as SaidasPorData)
    
  
    // 5. Formatar resposta final
    return Object.entries(resultado).map(([data, saidas]) => ({
      data,
      saidas
    }))
  }
  public async store({ request }: HttpContext) {
    const data = request.only([
      'descricao',
      'valor',
      'unidade_id',
      'forma_pagamento',
      'data_saida'
    ]) as SaidaData
  
    // Garante que data_saida seja um DateTime, se fornecida
    if (data.data_saida && typeof data.data_saida === 'string') {
      const parsedDate = DateTime.fromISO(data.data_saida)
      if (!parsedDate.isValid) {
        throw new Error('Formato de data inválido. Use YYYY-MM-DD')
      }
      data.data_saida = parsedDate
    }
    
  
    return await Saida.create(data)
  }
  
  public async show({ params }: HttpContext) {
    return await Saida.query()
      .where('id', params.id)
      .preload('unidade')
      .firstOrFail()
  }

  public async update({ params, request }: HttpContext) {
    const saida = await Saida.findOrFail(params.id)
    const data = request.only(['descricao', 'valor', 'tipo', 'data_saida'])

    if (data.data_saida) {
      data.data_saida = DateTime.fromISO(data.data_saida)
    }

    saida.merge(data)
    await saida.save()
    return saida
  }

  public async destroy({ params, response }: HttpContext) {
    const saida = await Saida.findOrFail(params.id)
    await saida.delete()
    return response.noContent()
  }
}