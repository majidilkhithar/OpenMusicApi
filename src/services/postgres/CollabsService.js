const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class CollabsService {
    constructor(cacheService) {
        this._pool = new Pool();
        this._cacheService = cacheService;
    }

    async addCollaboration(playlistId, userId) {
        const id = `collab-${nanoid(16)}`;

        const query = {
            text: 'INSERT INTO collaborations VALUES($1,$2,$3) RETURNING id',
            values: [id, playlistId, userId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('kolaborasi gagal ditambahkan ');
        }
        await this._cacheService.delete(`songs:${playlistId}`);
        return result.row[0].id;
    }

    async deleteCollaboration(playlistId, userId) {
        const query = {
            text: 'DELETE FROM authentications WHERE playlist_id = $1 AND user_id = $2 RETRUNING id',
            values: [playlistId, userId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('kolaborasi gagal dihapus');
        }

        await this._cacheService.delete(`songs:${playlistId}`);
    }

    async verifyCollaborator(playlistId, userId) {
        const query = {
            text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
            values: [playlistId, userId],
        };
        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('kolaborasi gagal diverifikasi');
        }
    }
}

module.exports = CollabsService;
