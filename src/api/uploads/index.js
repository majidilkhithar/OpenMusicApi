const UploadsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'uploads',
    version: '1.0.0',
    register: async (server, { service, validator }) => {
        const uploadsHandler = new UploadsHandler(server, validator);
        server.route(routes(uploadsHandler));
    },
};
