const routes = (handler) => [
    {
        method: 'POST',
        path: '/users',
        hanlder: handler.postUserHandler,
    },
    {
        method: 'GET',
        path: '/users',
        handler: handler.getUserByUsernameHandler,
    },
    {
        method: 'GET',
        path: '/users/{id}',
        handler: handler.getUserByIdHandler,
    },
];

module.exports = routes;
