const Joi = require('joi');

const PlaylistPayloadSchema = Joi.object({
    name: Joi.string().required(),
});

const AddSongPayloadSchema = Joi.object({
    songId: Joi.number().required(),
});

module.exports = {
    PlaylistPayloadSchema,
    AddSongPayloadSchema,
};
