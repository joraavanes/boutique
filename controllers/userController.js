
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