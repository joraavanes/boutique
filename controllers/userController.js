const User = require('../models/User');

exports.getLogin = (req, res, next) => {
    res.render('user/login');
};

exports.postLogin = (req, res, next) => {
    req.session.authenticated = {
        state: true,
        _id: req.user._id
    };
    res.redirect('/');
};

exports.postLogout = (req, res, next) => {
    req.session.destroy();
    res.redirect('/');
};

exports.getSignup = (req, res, next) => {
    res.render('user/signup');
};

exports.postSignup = (req, res, next) => {
    const {email, password, name, surname} = req.body;

    const user = new User({email, password, name, surname, userConfirmed: false});

    user.signup()
        .then(result => res.render('user/signup', {formmsg: result}))
        .catch(err => res.render('user/signup', {errmsg: err}));
};

exports.getResetPassword = (req, res, next) => {};

exports.postResetPassword = (req, res, next) => {};