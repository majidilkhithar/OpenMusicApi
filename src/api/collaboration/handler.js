class CollabsHandler {
    constructor(collabsServices, playlistsService, validator) {
        this._collabsServices = collabsServices;
        this._playlistsService = playlistsService;
        this._validator = validator;
        this.postCollabsHandler = this.postCollabsHandler.bind(this);
        this.deleteCollabsHandler = this.deleteCollabsHandler.bind(this);
    }

    async postCollabsHandler(request, h) {
        try {
            this._validator.validateCollaborationPayload(request.payload);

            const { id: credentialId } = request.auth.credentials;
            const { playlistId, userId } = request.payload;

            await this._playlistsService.verifyplaylists(playlistId, credentialId);

            const collaborationId = await this._collabsServices.addCollaboration(playlistId, userId);
            const response = h.response({
                status: 'success',
                message: 'kolaborasi berhasil ditambahkan',
                data: {
                    collaborationId,
                },
            });
            response.code(201);
            return response;
        } catch (error) {
            return error;
        }
    }

    async deleteCollabsHandler(request) {
        try {
            this._validator.validateCollaborationPayload(request.payload);
            const { id: credentialId } = request.auth.credentials;
            const { playlistId, userId } = request.payload;

            await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
            await this._collabsServices.deleteCollabsHandler(playlistId, userId);

            return {
                status: 'success',
                message: 'kolaborasi berhasil dihapus',
            };
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}

module.exports = CollabsHandler;
