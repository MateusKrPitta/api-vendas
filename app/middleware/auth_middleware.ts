// app/middleware/auth_middleware.ts
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'

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
      const isTokenExpired = error instanceof Error &&
        (error.message.includes('expired') ||
          error.message.includes('E_EXPIRED_TOKEN') ||
          error.message.includes('Token expired'))

      if (isTokenExpired) {
        ctx.session!.flash('error', 'Sua sessão expirou. Por favor, faça login novamente.')
      } else {
        ctx.session!.flash('error', 'teste')
      }

      if (ctx.request.accepts(['json'])) {
        return ctx.response.status(401).send({
          message: isTokenExpired
            ? 'Sua sessão expirou. Por favor, faça login novamente.'
            : 'Sua sessão expirou. Por favor, faça login novamente.',
          error: isTokenExpired ? 'E_EXPIRED_TOKEN' : 'E_UNAUTHORIZED_ACCESS'
        })
      }


      return ctx.response.redirect(this.redirectTo)
    }
  }
}