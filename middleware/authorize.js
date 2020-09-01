module.exports = (req, res, next) => {
    if(!req.session.auth) 
        return res.redirect('/user/login');
        
    next();
};