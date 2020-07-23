const crypto = require('crypto');

const randomBytes = user => {
    return new Promise((resolve, reject) => {
        return crypto.randomBytes(32, (err, buffer) => {
            if(err) return reject();

            return resolve(buffer.toString('hex'), user);
        });
    });
};

module.exports = randomBytes;