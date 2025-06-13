// app/controllers/relatorios_saidas_controller.ts
import { HttpContext } from '@adonisjs/core/http'
import RelatorioSaida from '#models/relatorio_saida'
import Saida from '#models/saida'
import { DateTime } from 'luxon'

export default class RelatoriosSaidasController {
  /**
   * Lista todos os relatórios de saídas
   */
  public async index({ response }: HttpContext) {
    try {
      const relatorios = await RelatorioSaida.query().orderBy('ano', 'desc').orderBy('mes', 'desc')

      return response.status(200).json({
        success: true,
        message: 'Relatórios de saídas listados com sucesso',
        data: relatorios,
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Erro ao listar relatórios de saídas',
        error: (error as Error).message,
      })
    }
  }

  /**
   * Relatório de saídas por unidade
   */
  public async porUnidade({ params, response }: HttpContext) {
    const { unidadeId } = params

    try {
      const relatorios = await this._calcularRelatoriosEmTempoReal(unidadeId)
      return response.status(200).json({
        success: true,
        message: 'Relatórios de saídas por unidade recuperados com sucesso',
        data: relatorios,
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Erro ao buscar relatórios de saídas da unidade',
        error: (error as Error).message,
      })
    }
  }

  /**
   * Gera relatório mensal de saídas
   */
  public async gerarRelatorioMensal({ params, response }: HttpContext) {
    const { unidadeId, ano, mes } = params

    try {
      const relatorio = await this._gerarRelatorioMensal(
        Number.parseInt(unidadeId),
        Number.parseInt(ano),
        Number.parseInt(mes)
      )

      const relatorioSalvo = await RelatorioSaida.updateOrCreate(
        {
          unidadeId: Number.parseInt(unidadeId),
          ano: Number.parseInt(ano),
          mes: Number.parseInt(mes),
        },
        {
          dados: relatorio,
          totalValor: relatorio.totalValor,
          totalSaidas: relatorio.totalSaidas,
        }
      )

      return response.status(200).json({
        success: true,
        message: 'Relatório mensal de saídas gerado com sucesso',
        data: relatorioSalvo,
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Erro ao gerar relatório de saídas',
        error: (error as Error).message,
      })
    }
  }

  private async _gerarRelatorioMensal(unidadeId: number, ano: number, mes: number) {
    const startDate = DateTime.fromObject({ year: ano, month: mes, day: 1 })
    const endDate = startDate.endOf('month')

    const saidas = await Saida.query()
      .where('unidade_id', unidadeId)
      .where('data_saida', '>=', startDate.toJSDate())
      .where('data_saida', '<=', endDate.toJSDate())
      .orderBy('data_saida', 'asc')

    const saidasPorDia: Record<string, any> = {}
    let totalValor = 0
    let totalSaidas = 0

    for (const saida of saidas) {
      try {
        const dataSaidaJS = saida.getDataSaidaJSDate()
        const dataSaida = dataSaidaJS ? DateTime.fromJSDate(dataSaidaJS) : DateTime.now()

        if (!dataSaida.isValid) continue

        const dataFormatada = dataSaida.toFormat('yyyy-MM-dd')

        if (!saidasPorDia[dataFormatada]) {
          saidasPorDia[dataFormatada] = {
            data: dataFormatada,
            saidas: [],
            totalDia: 0,
          }
        }

        saidasPorDia[dataFormatada].saidas.push({
          id: saida.id,
          descricao: saida.descricao,
          valor: saida.valor,
          formaPagamento: saida.forma_pagamento,
        })

        saidasPorDia[dataFormatada].totalDia += saida.valor
        totalValor += saida.valor
        totalSaidas++
      } catch (error) {
        console.error(`Erro ao processar saída ID ${saida.id}:`, error)
      }
    }

    return {
      unidadeId,
      ano,
      mes,
      nomeMes: startDate.setLocale('pt-BR').monthLong,
      totalValor,
      totalSaidas,
      saidasPorDia: Object.values(saidasPorDia),
    }
  }

  private async _calcularRelatoriosEmTempoReal(unidadeId: number) {
    const saidas = await Saida.query().where('unidade_id', unidadeId).orderBy('data_saida', 'asc')

    const relatoriosPorMes: Record<string, any> = {}

    for (const saida of saidas) {
      try {
        // Usa o novo método seguro
        const dataSaidaJS = saida.getDataSaidaJSDate()
        const dataSaida = dataSaidaJS ? DateTime.fromJSDate(dataSaidaJS) : saida.createdAt

        if (!dataSaida.isValid) continue

        const chaveMes = `${dataSaida.year}-${dataSaida.month.toString().padStart(2, '0')}`

        if (!relatoriosPorMes[chaveMes]) {
          relatoriosPorMes[chaveMes] = {
            ano: dataSaida.year,
            mes: dataSaida.month,
            nomeMes: dataSaida.setLocale('pt-BR').monthLong,
            saidas: [],
            totalValor: 0,
            totalSaidas: 0,
          }
        }

        relatoriosPorMes[chaveMes].saidas.push({
          id: saida.id,
          descricao: saida.descricao,
          valor: saida.valor,
          formaPagamento: saida.forma_pagamento,
          data: dataSaida.toFormat('yyyy-MM-dd'),
        })

        relatoriosPorMes[chaveMes].totalValor += saida.valor
        relatoriosPorMes[chaveMes].totalSaidas++
      } catch (error) {
        console.error(`Erro ao processar saída ID ${saida.id}:`, error)
      }
    }

    return Object.values(relatoriosPorMes)
  }
}
