require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');

const ClientError = require('./src/exceptions/ClientError'); //memanggil fungsi pesan error untuk client

//element Lagu
const Songs = require('./src/api/songs');
const SongsService = require('./src/services/postgres/SongsService');
const SongsValidator = require('./src/validator/songs');

//element autentikasi
const auth = require('./src/api/auth');
const authService = require('./src/services/postgres/authService');
const authValidator = require('./src/validator/auth');

//element user
