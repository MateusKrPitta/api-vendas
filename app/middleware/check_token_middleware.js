export default class CheckTokenMiddleware {
    async handle(ctx, next) {
        const { auth, response } = ctx;
        try {
            await auth.use('api').authenticate();
            const token = auth.use('api').user?.currentAccessToken;
            if (!token || token.isExpired()) {
                return response.status(401).json({
                    status: false,
                    message: 'Token expirado. Faça login novamente.',
                    code: 'TOKEN_EXPIRED',
                });
            }
            await next();
        }
        catch (error) {
            return response.status(401).json({
                status: false,
                message: 'Token inválido ou expirado. Faça login novamente.',
                code: 'TOKEN_INVALID_OR_EXPIRED',
                debug: process.env.NODE_ENV === 'development' ? error.message : undefined,
            });
        }
    }
}
//# sourceMappingURL=check_token_middleware.js.map