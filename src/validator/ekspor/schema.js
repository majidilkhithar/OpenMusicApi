const Joi = require('joi');

const EksporSongsPayloadSchema = Joi.object({
    targetEmail: Joi.string().email({ tlds: true }).required(),
});

module.exports = EksporSongsPayloadSchema;
