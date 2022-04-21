const { CollaborationPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const CollaborationsValidator = {
    validatorCollaborationPayload: (payload) => {
        const validateResult = CollaborationPayloadSchema.validate(payload);
        if (validateResult.error) {
            throw new InvariantError(validateResult.error.message);
        }
    },
};

module.exports = CollaborationPayloadSchema;
