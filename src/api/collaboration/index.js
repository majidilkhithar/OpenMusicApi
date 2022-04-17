const routes = require('./routes');
const CollabsHandler = require('./handler');

module.exports = {
    name: 'Collabs',
    version: '1.0.0',
    register: async (
        server,
        { collabsServices, playlistsService, validator }
    ) => {
        const collabsHandler = new CollabsHandler(server, playlistsService, validator);
        server.route(routes(collabsHandler));
    },
};
