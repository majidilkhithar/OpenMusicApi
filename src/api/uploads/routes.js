const routes = (handler) => [
    {
        method: 'POST',
        path: '/upload/picture',
        handler: handler.postUploadImageHandler,
        options: {
            payload: {
                allow: 'multipart/form-data',
                multipart: true,
                output: 'stream',
                maxBytes: 1000 * 100 * 5,
            },
        },
    },
];

module.exports = routes;
