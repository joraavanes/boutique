const bcrypt = require('bcryptjs');

const genHash = password => {
    return new Promise((resolve, reject) => {
        return bcrypt.genSalt(9, (err, salt) => {
            if(err) return reject();
    
            bcrypt.hash(password, salt, (err, hash) => {
                if(err) return reject();
    
                return resolve(hash);
            })
        });
    });
};

module.exports = genHash;