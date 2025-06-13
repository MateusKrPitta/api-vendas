import Saida from '#models/saida';
import { DateTime } from 'luxon';
import Unidade from '#models/unidade';
export default class SaidasController {
    async index({ request }) {
        const { data } = request.only(['data']);
        const query = Saida.query().preload('unidade').orderBy('data_saida', 'desc');
        if (data) {
            try {
                const parsedDate = DateTime.fromISO(data);
                if (!parsedDate.isValid) {
                    throw new Error('Data inválida');
                }
                const inicioDoDia = parsedDate.startOf('day').toISO();
                const fimDoDia = parsedDate.endOf('day').toISO();
                query.whereBetween('data_saida', [inicioDoDia, fimDoDia]);
            }
            catch (error) {
                throw new Error('Formato de data inválido. Use YYYY-MM-DD');
            }
        }
        const saidas = await query.exec();
        const resultado = saidas.reduce((acc, saida) => {
            const dataSaida = saida.data_saida || saida.createdAt;
            const dataKey = dataSaida?.isValid ? dataSaida.toFormat('dd-MM-yyyy') : 'Data inválida';
            if (!acc[dataKey]) {
                acc[dataKey] = [];
            }
            acc[dataKey].push({
                id: saida.id,
                descricao: saida.descricao,
                valor: saida.valor,
                unidade_id: saida.unidadeId,
                unidade: saida.unidade,
                forma_pagamento: saida.forma_pagamento,
                data_registro: dataSaida?.toISO() ?? null,
            });
            return acc;
        }, {});
        return Object.entries(resultado).map(([data, saidas]) => ({
            data,
            saidas,
        }));
    }
    async store({ request, response }) {
        const payload = request.only([
            'descricao',
            'valor',
            'unidade_id',
            'forma_pagamento',
            'data_saida',
        ]);
        const unidade = await Unidade.find(payload.unidade_id);
        if (!unidade) {
            return response.status(404).json({ message: 'Unidade não encontrada' });
        }
        if (payload.data_saida && typeof payload.data_saida === 'string') {
            const parsedDate = DateTime.fromISO(payload.data_saida);
            if (!parsedDate.isValid) {
                return response.status(400).json({ message: 'Formato de data inválido. Use YYYY-MM-DD' });
            }
            payload.data_saida = parsedDate;
        }
        const saida = await Saida.create(payload);
        return response.status(201).json(saida);
    }
    async show({ params }) {
        return await Saida.query().where('id', params.id).preload('unidade').firstOrFail();
    }
    async update({ params, request, response }) {
        const saida = await Saida.findOrFail(params.id);
        const data = request.only(['descricao', 'valor', 'forma_pagamento', 'unidade_id']);
        if (data.unidade_id) {
            const unidade = await Unidade.find(data.unidade_id);
            if (!unidade) {
                return response.status(404).json({ message: 'Unidade não encontrada' });
            }
        }
        saida.merge(data);
        await saida.save();
        return response.json(saida);
    }
    async destroy({ params, response }) {
        const saida = await Saida.findOrFail(params.id);
        await saida.delete();
        return response.noContent();
    }
}
//# sourceMappingURL=saidas_controller.js.map