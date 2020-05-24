const User = require('../models/User');

module.exports = (req, res, next) => {
    User.findOne()
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(colors.red(err)));
};