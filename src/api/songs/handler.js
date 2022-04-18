class SongsHandler {
    constructor(service, validator) {
        this._service = service;
        this._validator = validator;

        this.postSongHandler = this.postSongHandler.bind(this);
        this.getSongHandler = this.getSongHandler.bind(this);
        this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
        this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
        this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
    }

    async postSongHandler(request, h) {
        try {
            this._validator.validateSongPayload(request.payload);
            const {
                title = 'untitled',
                year,
                performer,
                genre,
                duration,
            } = request.payload;

            const songId = await this._service.addSong({
                title, year, performer, genre, duration,
            });

            const response = h.response({
                status: 'success',
                message: 'Lagu berhasil ditambahkan',
                data: {
                    songId,
                },
            });
            response.code(201);
            return response;
        } catch (error) {
            return error;
        }
    }

    async getSongHandler() {
        try {
            const songs = await this._service.getSong();
            return {
                status: 'success',
                data: {
                    songs,
                },
            };
        } catch (error) {
            return error;
        }
    }

    async getSongByIdHandler(request) {
        try {
            const { id } = request.params;

            const song = await this._service.getSongById(id);

            return {
                status: 'success',
                data: {
                    song,
                },
            };
        } catch (error) {
            return error;
        }
    }

    async putSongByIdHandler(request) {
        try {
            this._validator.validateSongPayload(request.payload);
            const { id } = request.params;

            await this._services.editSongById(id, request.payload);

            return {
                status: 'success',
                message: 'Lagu berhasil diperbarui',
            };
        } catch (error) {
            return error;
        }
    }

    async deleteSongByIdHandler(request) {
        try {
            const { id } = request.params;
            await this._services.deleteSongById(id);

            return {
                status: 'success',
                message: 'Lagu berhasil dihapus',
            };
        } catch (error) {
            return error;
        }
    }
}

module.exports = SongsHandler;
