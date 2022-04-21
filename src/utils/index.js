/* eslint-disable camelcase */
// eslint-disable-next-line camelcase
const ClientError = require('../exceptions/ClientError');

const mapDBToModel = ({ id, title, performer }) => ({
    id,
    title,
    performer,
});

const mapDBToModelDetail = ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    created_at,
    update_at,
}) => ({
    id,
    title,
    performer,
    genre,
    duration,
    insertedAt: created_at,
    updateAt: update_at,
});

const errorHandler = (err, h) => {
    if (err instanceof ClientError) {
        const response = h.response({
            status: 'fail',
            message: err.message,
        });
        response.code(err.statusCode);
        return response;
    }

    // Jika Server Error
    const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
    });
    response.code(500);
    console.log(err);

    return response;
};

module.exports = { mapDBToModel, mapDBToModelDetail, errorHandler };
