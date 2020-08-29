const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {body} = require('express-validator');

router.get('/', userController.getLogin);

router.get('/login', userController.getLogin);

router.post('/login', [body('email').isEmail().normalizeEmail(), body('password').notEmpty()], userController.postLogin);

router.post('/logout', userController.postLogout);

// GET: /user/signup
router.get('/signup', userController.getSignup);

// POST: /user/signup
router.post(
    '/signup', 
    [
        body('email').isEmail().normalizeEmail().withMessage('Please type your email address'),
        body('password').custom((value, {req, loc, path}) => {
            if(value == '') throw new Error('Please type a password');

            if(value.length < 4 || value.length > 20) throw new Error('Min length is 4 and max is 20');

            if(value !== req.body.confirmPassword){
                throw new Error('Passwords dont match');
            }else{
                return value;
            }}),
        body('name').isLength({min: 3}).withMessage('Please type your name(atleast 3 characters)')
    ],
     userController.postSignup);

router.get('/resetpassword', userController.getResetPassword);

router.post('/resetPassword', userController.postResetPassword);

router.get('/newPassword/:token', userController.getNewPassword);

router.post('/newPassword/', userController.postNewPassword);

module.exports = router;