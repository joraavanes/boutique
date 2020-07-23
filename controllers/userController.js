const User = require('../models/User');
const randomBytes = require('../utils/randomBytes');

const { gmailTransporter } = require('../utils/mailer');

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

            return gmailTransporter.sendMail({
                to: email,
                from: 'onlinesales.shm@gmail.com',
                subject: 'Sign up succeeded',
                html: `<h2>You have successfully signed up</h2>
                        <p>Welcome ${name} ${surname} to your boutique store. You can login through this <a href="localhost:3000/user/login">link</a></p>.`
            });
        })
        .then(mail => console.log(mail))
        .catch(err => res.render('user/signup', {errmsg: err}));
};

exports.getResetPassword = (req, res, next) => {    
    res.render('user/resetPassword.hbs');
};

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
        .catch((err) => res.render('user/resetPassword', { errmsg: 'No users found' }));
};

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

exports.postNewPassword = (req, res, next) => {
    const {token, newPassword, confirmNewPassword, userId} = req.body;
    console.log(newPassword, confirmNewPassword);

    if(newPassword !== confirmNewPassword) return res.render('user/newPassword', {errmsg: 'Password dont match each other'});

    User.findOne({resetPasswordToken: token, _id: userId})
        .then(user => {
            if(!user) throw new Error();

            return User.newPassword(user.email, newPassword);
        })
        .then(user => {
            
            res.send('User password updated');
        })
        .catch(err => {
            res.render('user/newPassword', {errmsg: 'Something went wrong'});
        });

};