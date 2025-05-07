import FornecedoresController from '#controllers/fornecedores_controller'
import VendasController from '#controllers/vendas_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import SaidasController from '#controllers/saidas_controller'
import CategoriasController from '#controllers/categorias_controller'
import RelatoriosMensaisController from '#controllers/relatorios_mensais_controller'
import RelatoriosSaidasController from '#controllers/relatorios_saidas_controller'
import DashboardsController from '#controllers/dashboard_controller'
import ListaComprasController from '#controllers/lista_compras_controller'

const AuthController = () => import('#controllers/auth_controller')
const UnidadesController = () => import('#controllers/unidades_controller')
const UsuariosController = () => import('#controllers/usuarios_controller')

router.get('/', async () => {
  return { hello: 'world' }
})

router.post('/login', [AuthController, 'login'])

router.resource('unidades', UnidadesController).apiOnly()
router.get('/unidades-inativas', [UnidadesController, 'inativas'])
router.put('/unidades/:id/reativar', [UnidadesController, 'reativar'])

router.resource('usuarios', UsuariosController).apiOnly()
router.get('/usuarios-ativos', [UsuariosController, 'ativos'])
router.get('/usuarios-inativos', [UsuariosController, 'inativos'])
router.put('/usuarios/:id/reativar', [UsuariosController, 'reativar'])

router.resource('fornecedores', FornecedoresController).apiOnly()

router.group(() => {
  // Rotas de Vendas
  router.post('/vendas', [VendasController, 'store'])
  router.get('/vendas/dia', [VendasController, 'vendasPorDia']) // Agora com filtro de unidadeId
  router.get('/vendas/por-unidade', [VendasController, 'vendasPorUnidade']) // Nova rota
  router.get('/vendas/:id', [VendasController, 'show'])
  router.put('/vendas/:id', [VendasController, 'update'])
  router.delete('/vendas/:id', [VendasController, 'destroy'])

  router.put('/fornecedores/:id/reativar', [FornecedoresController, 'reativar'])

  router.get('/saidas', [SaidasController, 'index'])
  router.post('/saidas', [SaidasController, 'store'])
  router.get('/saidas/:id', [SaidasController, 'show'])
  router.put('/saidas/:id', [SaidasController, 'update'])
  router.delete('/saidas/:id', [SaidasController, 'destroy'])

  router.post('categorias', [CategoriasController, 'store'])
  router.get('categorias', [CategoriasController, 'index'])
  router.put('categorias/:id', [CategoriasController, 'update'])
  router.patch('categorias/:id/ativar', [CategoriasController, 'ativar'])
  router.patch('categorias/:id/inativar', [CategoriasController, 'inativar'])

  router.get('/relatorios-mensais', [RelatoriosMensaisController, 'index'])
  router.get('/relatorios-mensais/:unidadeId/:ano/:mes', [RelatoriosMensaisController, 'show'])
  router.post('/relatorios-mensais/gerar/:unidadeId/:ano/:mes', [RelatoriosMensaisController, 'generate'])
  router.delete('/relatorios-mensais/:id', [RelatoriosMensaisController, 'destroy'])
  router.get('/relatorios-mensais/unidade/:unidadeId', [RelatoriosMensaisController, 'porUnidade'])
    .where('unidadeId', router.matchers.number())
  
  router.get('/relatorios-saidas/unidade/:unidadeId', [RelatoriosSaidasController, 'porUnidade'])
  router.post('/relatorios-saidas/gerar/:unidadeId/:ano/:mes', [RelatoriosSaidasController, 'gerarRelatorioMensal'])
  
  router.get('/relatorio-mensal/detalhado', 'RelatorioMensalDetalhadoController.detalhado')

  router.get('/dashboard/:unidadeId', [DashboardsController, 'show'])

  router.get('/lista-compras', [ListaComprasController, 'index' ])
  router.post('/lista-compras', [ListaComprasController, 'store'])
  router.delete('/lista-compras/:id', [ListaComprasController, 'destroy'])


}).use(middleware.auth())