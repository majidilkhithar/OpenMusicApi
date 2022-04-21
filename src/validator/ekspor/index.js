const InvariantError = require('../../exceptions/InvariantError');
const validateEksporSongsPayloadSchema = require('./schema');

const EksporsValidator = {
    validateExportedSongsPayload: (payload) => {
        const validationResult = validateEksporSongsPayloadSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = EksporsValidator;
