const routes = (handler) => [
    {
        method: 'POST',
        path: '/collabs',
        handler: handler.postCollabsHandler,
        options: {
            auth: 'songsapp_jwt',
        },
    },
    {
        method: 'DELETE',
        path: '/collabs',
        handler: handler.deleteCollabsHandler,
        options: {
            auth: 'songsapp_jwt',
        },
    },
];

module.exports = routes;
