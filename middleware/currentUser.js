const User = require('../models/User');

module.exports = (req, res, next) => {
    User.findOne()
        .populate('cart.items.productId')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(colors.red(err)));
};