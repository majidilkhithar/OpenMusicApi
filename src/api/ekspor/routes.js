const routes = (handler) => [
    {
        method: 'POST',
        path: 'ekspor/playlists/{playlistId}',
        handler: handler.postEksporPlaylistHandler,
        options: {
            auth: 'songsapp_jwt',
        },
    },
];

module.exports = routes;
