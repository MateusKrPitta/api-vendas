// app/middleware/auth_middleware.ts
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'
import { errors } from '@adonisjs/auth'

export default class AuthMiddleware {
  redirectTo = '/login'

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    try {
      await ctx.auth.authenticateUsing(options.guards, { loginRoute: this.redirectTo })
      return next()
    } catch (error) {
      if (ctx.request.accepts(['json'])) {
        throw new errors.E_UNAUTHORIZED_ACCESS('Acesso não autorizado', {
          guardDriverName: ctx.auth.defaultGuard,
          redirectTo: this.redirectTo
        })
      }
      return ctx.response.redirect(this.redirectTo)
    }
  }
}