const User = require('../models/User');
const colors = require('colors');

module.exports = (req, res, next) => {    
    if(!req.session.auth) return next();

    User.findOne({_id: req.session.auth._id})
        // .populate('cart.items.productId')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(colors.red(err)));
};