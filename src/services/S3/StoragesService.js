const AWS = require('aws-sdk');

class StoragesService {
    constructor() {
        this._S3 = new AWS.S3();
    }

    writeFile(file, meta) {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            key: +new Date() + meta.filename,
            Body: file._data,
            ContentType: meta.headers['content-type'],
        };

        return new Promise((resolve, reject) => {
            this._S3.upload(params, (err, data) => {
                if (err) return reject(err);

                return resolve(data.Location);
            });
        });
    }
}

module.exports = StoragesService;
