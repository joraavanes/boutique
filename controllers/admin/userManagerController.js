const User = require('../../models/User');

exports.getUsers = (req, res, next) => {

    User.find()
        .sort({ email: 1 })
        .then(users => {

            res.render('admin/userManager/default',{
                pageTitle: 'Users',
                users
            });
        })
        .catch(err => {
            return next(err);
        });

};