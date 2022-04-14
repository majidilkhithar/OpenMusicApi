require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');

const ClientError = require('./src/exceptions/ClientError'); // memanggil fungsi pesan error untuk client

// element autentikasi
const Auth = require('./src/api/auth');
const AuthService = require('./src/services/postgres/authService');
const AuthValidator = require('./src/validator/auth');
const TokenManager = require('./tokenize/TokenManager');

// element user
const Users = require('./src/api/users');
const UsersService = require('./src/services/postgres/UsersService');
const UsersValidator = require('./src/validator/users');

// element Lagu
const Songs = require('./src/api/songs');
const SongsService = require('./src/services/postgres/SongsService');
const SongsValidator = require('./src/validator/songs');

// element playlists
const Playlists = require('./src/api/playlists');
const PlaylistsService = require('./src/services/postgres/PlaylistsService');
const PlaylistsValidator = require('./src/validator/playlists');

// element kolaborasi
const Collabs = require('./src/api/collaboration');
const CollabsService = require('./src/services/postgres/CollabsService');
const CollabsValidator = require('./src/validator/collaboration');

// element ekspor
const Ekspors = require('./src/api/ekspors');
const EksporService = require('./src/services/rabbitmq/ProducerSerives');
const EksporValidator = require('./src/validator/ekspors');

// element unggah data lagu
const Uploads = require('./src/api/uploads');
const UploadsService = require('./src/services/S3/StoragesService');
const UploadsValidator = require('./src/validator/uploads');

// cached
const CacheService = require('./src/services/redis/CacheService');

const init = async () => {
    const cacheService = new CacheService();
    const songsService = new SongsService();
    const usersService = new UsersService();
    const authService = new AuthService();
    const collabsService = new CollabsService(cacheService);
    const playlistsService = new PlaylistsService(
        collabsService,
        cacheService
    );
    const StoragesService = new UploadsService();

    // konteks server dengan Hapi
    const server = Hapi.Server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    // plugin ekternal
    await server.register([
        {
            plugin: Jwt,
        },
        {
            plugin: Inert,
        },
    ]);

    // Mendefinisikan auth jwt
    server.auth.strategy('songsapp_jwt', 'jwt', {
        key: process.env.ACCESS_TOKEN_KEY,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: process.env.ACCESS_TOKEN_AGE,
        },
        validate: (artifacts) => ({
            isValid: true,
            credentials: {
                id: artifacts.decoded.playload.id,
            },
        }),
    });

    server.ext('onPreResponse', (request, h) => {
        // Mendapatkan response dari request
        const { response } = request;

        if (response instanceof ClientError) {
            const newResponse = h.response({
                status: 'fail',
                message: response.message,
            });
            newResponse.code(response.statusCode);
            return newResponse;
        }

        // server ERROR !!
        if (response instanceof Error) {
            const newResponse = h.response({
                status: 'error',
                message: response.output.payload.message,
            });
            newResponse.code(response.output.statusCode);
            return newResponse;
        }

        // jika bukan clientError, di lanjutkan tanpa proses pengecekan
        return response.continue || response;
    });

    await server.register([
        {
            plugin: Songs,
            options: {
                service: songsService,
                validator: SongsValidator,
            },
        },
        {
            plugin: Users,
            options: {
                service: usersService,
                validator: UsersValidator,
            },
        },
        {
            plugin: Auth,
            options: {
                authService,
                usersService,
                tokenManager: TokenManager,
                validator: AuthValidator,
            },
        },
        {
            plugin: Playlists,
            options: {
                service: playlistsService,
                validator: PlaylistsValidator,
            },
        },
        {
            plugin: Collabs,
            options: {
                collabsService,
                playlistsService,
                validator: CollabsValidator,
            },
        },
        {
            plugin: Ekspors,
            options: {
                service: EksporService,
                validator: EksporValidator,
                playlistsService,
            },
        },
        {
            plugin: Uploads,
            options: {
                service: StoragesService,
                validator: UploadsValidator,
            },
        },
    ]);

    await server.start();
    console.log(`server berjalan pada ${server.info.uri}`);
};

init();
