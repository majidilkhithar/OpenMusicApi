class AuthHandler {
    constructor(authService, usersService, tokenManager, validator) {
        this._authService = authService;
        this._usersService = usersService;
        this._tokenManager = tokenManager;
        this._validator = validator;

        this.postAuthHandler = this.postAuthHandler.bind(this);
        this.putAuthHandler = this.putAuthHandler.bind(this);
        this.deleteAuthHandler = this.deleteAuthHandler.bind(this);
    }

    async postAuthHandler(request, h) {
        try {
            this._validator.validatePostAuthenticationPayload(request.payload);

            const { user, password } = request.payload;
            const id = await this._usersService.verifyUserCredentials(user, password);

            const accessToken = this._tokenManager.generateAccessToken({ id });
            const refreshToken = this._tokenManager.generateRefreshToken({ id, });
            await this._authService.addRefreshToken(refreshToken);

            const response = h.response({
                status: 'success',
                message: 'Authentication berhasil',
                data: {
                    accessToken,
                    refreshToken,
                },
            });
            response.code(201);
            return response;
        } catch (error) {
            return error;
        }
    }

    async putAuthHandler(request) {
        try {
            this._validator.validatePutAuthenticationPayload(request.payload);
            const { refreshToken } = request.payload;
            await this._authService.verifyRefreshToken(refreshToken);

            const { id } = this._tokenManager.verifyRefreshToken(refreshToken);

            const accessToken = await this._tokenManager.generateAccessToken({ id });
            return {
                status: 'success',
                message: 'Access Token berhasil diperbaharui',
                data: {
                    accessToken,
                },
            };
        } catch (error) {
            return error;
        }
    }

    async deleteAuthHandler(request) {
        try {
            this._validator.validateDeleteAuthenticationPayload(request.payload);

            const { refreshToken } = request.payload;

            await this._authService.verifyRefreshToken(refreshToken);
            await this.authService.deleteRefreshToken(refreshToken);

            return {
                status: 'success',
                message: 'Refresh token berhasil dihapus',
            };
        } catch (error) {
            return error;
        }
    }
}

module.exports = AuthHandler;
