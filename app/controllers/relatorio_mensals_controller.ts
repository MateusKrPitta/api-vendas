import { DateTime } from 'luxon'
import Database from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'

export default class RelatorioMensalDetalhadoController {
  public async detalhado({ request, response }: HttpContext) {
    const { ano, mes, unidadeId } = request.only(['ano', 'mes', 'unidadeId'])

    const inicio = DateTime.fromObject({ year: ano, month: mes, day: 1 }).startOf('month')
    const fim = inicio.endOf('month')

    // Busca as vendas com join nas tabelas de unidade e categoria
    const vendas = await Database.from('vendas')
      .join('unidades', 'vendas.unidade_id', '=', 'unidades.id')
      .join('categorias', 'vendas.categoria_id', '=', 'categorias.id')
      .select(
        'vendas.id',
        'vendas.produto',
        'vendas.quantidade',
        'vendas.valor',
        'vendas.forma_pagamento',
        'vendas.data_venda',
        'unidades.nome as unidade_nome',
        'categorias.nome as categoria_nome'
      )
      .whereBetween('vendas.data_venda', [inicio.toSQL()!, fim.toSQL()!])
      .andWhere('vendas.unidade_id', unidadeId)

    const dias: Record<string, any[]> = {}

    for (const venda of vendas) {
      const data = DateTime.fromSQL(venda.data_venda)
      const dia = data.toFormat('dd')

      if (!dias[dia]) dias[dia] = []

      dias[dia].push({
        id: venda.id,
        produto: venda.produto,
        quantidade: venda.quantidade,
        valor: Number(venda.valor),
        formaPagamento: formaPagamentoTexto(venda.forma_pagamento),
        unidade: venda.unidade_nome,
        categoria: venda.categoria_nome,
        hora: data.toFormat('HH:mm'),
      })
    }

    return response.json({
      unidade: {
        id: unidadeId,
        nome: vendas[0]?.unidade_nome || 'Desconhecida',
      },
      [inicio.setLocale('pt-BR').toFormat('LLLL')]: {
        ano,
        mes,
        nomeMes: inicio.setLocale('pt-BR').toFormat('LLLL'),
        datas: dias,
      },
    })
  }
}

function formaPagamentoTexto(codigo: number) {
  switch (codigo) {
    case 1:
      return 'Dinheiro'
    case 2:
      return 'Cartão'
    case 3:
      return 'PIX'
    default:
      return 'Desconhecido'
  }
}
