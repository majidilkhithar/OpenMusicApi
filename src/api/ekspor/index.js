const EksporHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'ekspor',
    version: '1.0.0',
    register: async (server, { service, validator, playlistsService }) => {
        const eksporHandler = new EksporHandler(server, validator, playlistsService);
        server.route(routes(eksporHandler));
    },
};
