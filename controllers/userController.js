const User = require('../models/User');
const colors = require('colors');

const { transporter } = require('../utils/mailer');

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
            req.session.save(() => res.redirect('/'));            
        })
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
        .then(result => {

            res.render('user/signup', {formmsg: result});

            // return transporter.sendMail({
            //     to: email,
            //     from: 'jora_a@outlook.com',
            //     subject: 'Congratulations',
            //     html: `<h2>You have successfully signed up</h2>
            //             <p>Welcome ${name} ${surname} to your boutique store. You can login through this <a href="localhost:3000/user/login">link</a></p>.`
            // });
        })
        .then(mail => console.log(mail))
        .catch(err => res.render('user/signup', {errmsg: err}));
};

exports.getResetPassword = (req, res, next) => {};

exports.postResetPassword = (req, res, next) => {};