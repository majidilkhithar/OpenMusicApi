const client = new ClientError = require('./ClientError');

class AuthError extends ClientError {
    constructor(message) {
        super(message, 401);
        this.nama = 'AuthError';
    }
}

module.exports = AuthError;