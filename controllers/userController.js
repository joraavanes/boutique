const {validationResult} = require('express-validator');
const colors = require('colors');

const User = require('../models/User');
const randomBytes = require('../utils/randomBytes');

const { gmailTransporter } = require('../utils/mailer');

// GET: /user/login
exports.getLogin = (req, res, next) => {
    res.render('user/login');
};

// POST: /user/login
exports.postLogin = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).render('user/login', 
            {errMessage: 'Please enter your username and password'});
    }

    const {email, password} = req.body;

    User.login(email, password)
        .then(_id => {
            req.session.auth = {
                state: true,
                _id
            };
            req.session.save(() => res.redirect('/'));            
        })
        .catch((err) => res.status(400).render('user/login', {errMessage: 'Username or password is incorrect'}));
};

// POST: /user/logout
exports.postLogout = (req, res, next) => {
    req.session.destroy();
    res.redirect('/');
};

// GET: /user/signup
exports.getSignup = (req, res, next) => {
    res.render('user/signup');
};

// POST: /user/signup
exports.postSignup = (req, res, next) => {
    const {email, password, name, surname} = req.body;

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).render('user/signup', {
            errMessage: errors.array(),
            email,
            name,
            surname
        });
    }

    const user = new User({email, password, name, surname, userConfirmed: false});

    user.signup()
        .then(result => {

            res.render('user/signup', {formmsg: result});

            /* return*/ gmailTransporter.sendMail({
                to: email,
                from: 'onlinesales.shm@gmail.com',
                subject: 'Sign up succeeded',
                html: `<h2>You have successfully signed up</h2>
                        <p>Welcome ${name} ${surname} to your boutique store. You can login through this <a href="localhost:3000/user/login">link</a></p>.`
            });
        })
        // .then(mail => console.log(mail))
        .catch(err => {
            res.render('user/signup', {
                errmsg: err,
                email,
                name,
                surname
            });
            // throw new Error(err);
        });
};

// GET: /user/resetPassword
exports.getResetPassword = (req, res, next) => {    
    res.render('user/resetPassword');
};

// POST: /user/resetPassword
exports.postResetPassword = (req, res, next) => {
    const {email} = req.body;

    randomBytes()
        .then(token => {
            
            return User.generateResetPasswordToken(email, token);
        })
        .then(user => {
            
            return gmailTransporter.sendMail({
                to: user.email,
                from: '',
                subject: 'Reset password link',
                html: `<h2>New password for your account</h2>
                <p>Please click on the <a href="http://localhost:3000/user/newPassword/${user.resetPasswordToken}">link</a> in order to define a new password</p>`
            });
        })
        .then(email => res.render('user/resetPassword', { formmsg: 'Please check your mailbox. An email including a link is sent for you.'}))
        .catch((err) => {
            let error = new Error(err);
            error.httpStatusCode = err?.httpStatusCode ?? 500;

            if(error.httpStatusCode == 404){
                return res.render('user/resetPassword', { errmsg: err.message });
            }

            return next(error);
        });
};

// GET: /user/newPassword/:token
exports.getNewPassword = (req, res, next) => {
    const {token} = req.params;

    User.findOne({resetPasswordToken: token, resetPasswordExpiration: { $gt: new Date().getTime() }})
        .then(user => {
            if(!user) throw new Error();

            res.render('user/newPassword', {user, token});
        })
        .catch(err => {
            
            res.render('user/newPassword', {errmsg: 'No users found'});
        })
};

// POST: /user/newPassword
exports.postNewPassword = (req, res, next) => {
    const {token, newPassword, confirmNewPassword, userId} = req.body;

    if(newPassword !== confirmNewPassword) return res.render('user/newPassword', {errmsg: 'Password dont match each other'});

    User.findOne({resetPasswordToken: token, _id: userId})
        .then(user => {
            if(!user) throw new Error();

            return User.newPassword(user.email, newPassword);
        })
        .then(user => {
            
            res.render('user/newPassword', {
                message: 'Your new password has been successfully submitted. Log in to your <a href="/user/login">account</a>.'
            });
        })
        .catch(err => {
            res.render('user/newPassword', {errmsg: 'Something went wrong'});
        });

};