const { errorHandler } = require('../utils');

class Usershandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postUserhandler = this.postUserhandler.bind(this);
        this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
    }

    async postUserhandler(request, h) {
        try {
            this._validator.validateUserPayload(request.payload, h);
            const { username, password, fullname } = request.payload;

            const userId = await this._service.addUser({
                username,
                password,
                fullname,
            });
            const response = h.response({
                status: 'success',
                message: 'User berhasil ditambahkan',
                data: {
                    userId,
                },
            });
            response.code(201);
            return response;
        } catch (error) {
            return this.handleError(error, h);
        }
    }

    async getUserByIdHandler(request, h) {
        try {
            const { id } = request.params;
            const user = await this._service.getUserById(id);
            return {
                status: 'success',
                data: {
                    user,
                },
            };
        } catch (error) {
            return errorHandler(error, h);
        }
    }

    async getUserByUsernameHandler(request, h) {
        try {
            const { username = '' } = request.query;
            const users = await this._service.getUserByUsername(username);
            return {
                status: 'success',
                data: {
                    users,
                },
            };
        } catch (error) {
            return errorHandler(error, h);
        }
    }
}

module.exports = Usershandler;
