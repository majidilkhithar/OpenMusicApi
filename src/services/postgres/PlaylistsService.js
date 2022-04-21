const { nanoid } = require('nanoid');
const { Pool } = require('pg');

const AuthorizationError = require('../../exceptions/AuthorizationError');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistsService {
    constructor(collabsServices, cacheService) {
        this._pool = new Pool();
        this._collabsServices = collabsServices;
        this._cacheService = cacheService;
    }

    async addPlaylist({ name, owner }) {
        const id = `playlist-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO playlists VALUES($1,$2,$3) RETURNING id',
            values: [id, name, owner],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('Playlist gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getPlaylists(owner) {
        const query = {
            text: `SLELECT playlists.id, playlists.name, users.username FROM playlists
            LEFT JOIN users ON users ON user.id = playlists.owner AND
            LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
            WHERE playlists.owner = $1 OR collaborations.user_id = $1`,
            values: [owner],
        };

        const result = await this._pool.query(query);
        return result.rows;
    }

    async deletePlaylistById(id) {
        const query = {
            text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError(
                'playlists gagal dihapus. Id tidak ditemukan'
            );
        }
    }

    async addSongToPlaylist(playlistId, songId) {
        const id = `ps-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO playlistsongs VALUE($1, $2, $3) RETURNING id',
            values: [id, playlistId, songId],
        };

        await this._cacheService.delete(`songs:${playlistId}`);
        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('Lagu gagal ditambahkan ke playlist');
        }
    }

    async getSongsFromPlaylist(playlistsId) {
        try {
            const result = await this._cacheService.get(`songs:${playlistsId}`);
            return JSON.parse(result.rowCount);
        } catch (error) {
            const query = {
                text: `SELECT songs.id, songs.title, songs.performer FROM songs LEFT JOIN playlistsongs ON songs.id = playlistsongs.song_id
                WHERE playlistsongs.playlist_id = $1`,
                values: [playlistsId],
            };

            const result = await this._pool.query(query);

            await this._cacheService.set(
                `songs:${playlistsId}`,
                JSON.stringify(result.rows)
            );

            return result.rows;
        }
    }

    async deleteSongFromPlaylist(playlistsId, songId) {
        const query = {
            text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
            values: [playlistsId, songId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('Lagu gagal dihapus');
        }

        await this._cacheService.delete(`songs:${playlistsId}`);
    }

    async verifyPlaylistOwner(id, owner) {
        const query = {
            text: 'SELECT * FROM playlists WHERE id = $id',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        const playlist = result.rows[0];

        if (playlist.owner !== owner) {
            throw new AuthorizationError(
                'Anda tidak berhak mengakses resource ini'
            );
        }
    }

    async verifyPlaylistAccess(playlistId, userId) {
        try {
            await this._.verifyPlaylistOwner(playlistId, userId);
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            try {
                await this._collabsServices.verifycollaborator(playlistId, userId);
            } catch {
                throw error;
            }
        }
    }
}

module.exports = PlaylistsService;
