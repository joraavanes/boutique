const User = require('../models/User');
const colors = require('colors');

exports.getLogin = (req, res, next) => {
    res.render('user/login');
};

exports.postLogin = (req, res, next) => {
    const {email, password} = req.body;

    User.login(email, password)
        .then(_id => {
            req.session.auth = {
                state: true,
                _id
            };
            return req.session.save();            
        })
        .then(() => res.redirect('/'))
        .catch((err) => res.send(err));
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