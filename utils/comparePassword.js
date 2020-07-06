const bcrypt = require('bcryptjs');

const comparePassword = (password, hash)  => {
    return new Promise((resolve, reject) => {
        return bcrypt.compare(password, hash, (err, result) => {
            if(result) return resolve();
            
            return reject('Username or password is wrong');
        });
    });
};

module.exports = comparePassword;