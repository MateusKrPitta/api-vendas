import Unidade from '#models/unidade'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class UnidadeSeeder extends BaseSeeder {
  public async run() {
    await Unidade.create({
      id: 1,
      nome: 'Unidade Central',
    })
  }
}
