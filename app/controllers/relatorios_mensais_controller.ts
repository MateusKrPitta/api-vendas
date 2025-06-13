import { HttpContext } from '@adonisjs/core/http'
import RelatorioMensal from '#models/relatorio_mensal'
import Venda from '#models/venda'
import { DateTime } from 'luxon'
import Unidade from '#models/unidade'
import RelatorioMensalVenda from '#models/relatorio_mensal_venda'

export default class RelatoriosMensaisController {
  /**
   * Lista todos os relatórios existentes
   */
  public async index({ response }: HttpContext) {
    try {
      const relatorios = await RelatorioMensal.query().orderBy('ano', 'desc').orderBy('mes', 'desc')

      return response.status(200).json({
        success: true,
        message: 'Relatórios listados com sucesso',
        data: relatorios,
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Erro ao listar relatórios',
        error: (error as Error).message,
      })
    }
  }

  public async show({ params, response }: HttpContext) {
    const { unidadeId } = params

    try {
      const relatorio = await RelatorioMensal.query()
        .where('unidade_id', unidadeId)
        .orderBy('ano', 'desc')
        .orderBy('mes', 'desc')
        .firstOrFail()

      return response.status(200).json({
        success: true,
        message: 'Relatório encontrado',
        data: relatorio,
      })
    } catch (error) {
      return response.status(404).json({
        success: false,
        message: 'Relatório não encontrado',
        error: (error as Error).message,
      })
    }
  }

  /**
   * Gera um novo relatório
   */
  public async generate({ params, response }: HttpContext) {
    const { unidadeId, ano, mes } = params

    try {
      const relatorio = await this._gerarRelatorio(
        Number.parseInt(unidadeId),
        Number.parseInt(ano),
        Number.parseInt(mes)
      )

      const relatorioSalvo = await RelatorioMensalVenda.updateOrCreate(
        {
          unidadeId: Number.parseInt(unidadeId),
          ano: Number.parseInt(ano),
          mes: Number.parseInt(mes),
        },
        {
          total_vendas: relatorio.totalVendas,
          total_itens_vendidos: relatorio.totalQuantidade, // ajuste para corresponder ao modelo
          total_valor: relatorio.totalValor,
          // Adicione outros campos conforme necessário
        }
      )

      return response.status(200).json({
        success: true,
        message: 'Relatório gerado com sucesso',
        data: relatorioSalvo,
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Erro ao gerar relatório',
        error: (error as Error).message,
      })
    }
  }

  /**
   * Método privado para gerar relatório
   */
  private async _gerarRelatorio(unidadeId: number, ano: number, mes: number) {
    const startDate = DateTime.fromObject({
      year: ano,
      month: mes,
      day: 1,
    })
    const endDate = startDate.endOf('month')

    const vendas = await Venda.query()
      .where('unidade_id', unidadeId)
      .where('data_venda', '>=', startDate.toJSDate())
      .where('data_venda', '<=', endDate.toJSDate())
      .preload('unidade')
      .preload('categoria')
      .orderBy('data_venda', 'asc')

    const vendasPorDia: Record<
      string,
      {
        data: string
        vendas: any[]
        totalDia: number
        totalQuantidadeDia: number
      }
    > = {}

    let totalVendas = 0
    let totalQuantidade = 0
    let totalValor = 0

    for (const venda of vendas) {
      const dataVenda =
        venda.data_venda instanceof Date
          ? DateTime.fromJSDate(venda.data_venda)
          : DateTime.fromISO(venda.data_venda.toString())

      const dataFormatada = dataVenda.toFormat('yyyy-MM-dd')

      if (!vendasPorDia[dataFormatada]) {
        vendasPorDia[dataFormatada] = {
          data: dataFormatada,
          vendas: [],
          totalDia: 0,
          totalQuantidadeDia: 0,
        }
      }

      vendasPorDia[dataFormatada].vendas.push({
        id: venda.id,
        produto: venda.nome,
        quantidade: venda.quantidade,
        valor: venda.valor,
        formaPagamento: venda.forma_pagamento,
        unidade: {
          id: venda.unidade.id,
          nome: venda.unidade.nome,
        },
        categoria: {
          id: venda.categoria.id,
          nome: venda.categoria.nome,
        },
      })

      vendasPorDia[dataFormatada].totalDia += venda.valor
      vendasPorDia[dataFormatada].totalQuantidadeDia += venda.quantidade

      totalVendas++
      totalQuantidade += venda.quantidade
      totalValor += venda.valor
    }

    return {
      unidadeId,
      ano,
      mes,
      nomeMes: startDate.setLocale('pt-BR').monthLong,
      totalVendas,
      totalQuantidade,
      totalValor,
      vendasPorDia: Object.values(vendasPorDia),
    }
  }

  /**
   * Remove um relatório
   */
  public async destroy({ params, response }: HttpContext) {
    try {
      const relatorio = await RelatorioMensal.findOrFail(params.id)
      await relatorio.delete()

      return response.status(200).json({
        success: true,
        message: 'Relatório removido com sucesso',
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Erro ao remover relatório',
        error: (error as Error).message,
      })
    }
  }

  public async porUnidade({ params, response }: HttpContext) {
    const { unidadeId } = params

    try {
      // Verifica se a unidade existe
      const unidade = await Unidade.find(unidadeId)
      if (!unidade) {
        return response.status(404).json({
          success: false,
          message: 'Unidade não encontrada',
        })
      }

      // Calcula em tempo real (não usa relatórios salvos)
      const relatorios = await this._calcularRelatoriosEmTempoReal(unidadeId)

      return response.status(200).json({
        success: true,
        message: 'Dados calculados com sucesso',
        data: relatorios,
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Erro ao calcular relatórios',
        error: (error as Error).message,
      })
    }
  }
  private async _calcularRelatoriosEmTempoReal(unidadeId: number) {
    const vendas = await Venda.query()
      .where('unidade_id', unidadeId)
      .preload('unidade')
      .preload('categoria')
      .orderBy('data_venda', 'asc')

    const relatoriosPorMes: Record<string, any> = {}

    for (const venda of vendas) {
      // Convertendo a data corretamente
      const dataVenda =
        venda.data_venda instanceof Date
          ? DateTime.fromJSDate(venda.data_venda)
          : DateTime.fromISO(venda.data_venda.toString())

      const chaveMes = `${dataVenda.year}-${dataVenda.month.toString().padStart(2, '0')}`

      if (!relatoriosPorMes[chaveMes]) {
        relatoriosPorMes[chaveMes] = {
          ano: dataVenda.year,
          mes: dataVenda.month,
          nomeMes: dataVenda.setLocale('pt-BR').monthLong,
          vendas: [],
          totalVendas: 0,
          totalQuantidade: 0,
          totalValor: 0,
        }
      }

      relatoriosPorMes[chaveMes].vendas.push({
        id: venda.id,
        produto: venda.nome,
        quantidade: venda.quantidade,
        valor: venda.valor,
        formaPagamento: venda.forma_pagamento,
        unidade: venda.unidade,
        categoria: venda.categoria,
        data: dataVenda.toFormat('yyyy-MM-dd'),
      })

      relatoriosPorMes[chaveMes].totalVendas++
      relatoriosPorMes[chaveMes].totalQuantidade += venda.quantidade
      relatoriosPorMes[chaveMes].totalValor += venda.valor
    }

    return Object.values(relatoriosPorMes)
  }
}
