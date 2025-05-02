import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class UsuarioSeeder extends BaseSeeder {
  async run() {
    await User.create({
      fullName: 'Mateus Kronbauer',
      email: 'mateus@email.com',
      password: '123456',
      unidadeId: 1,
      tipo: 1,
      ativo: true,
    })
  }
}