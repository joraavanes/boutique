const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/login', userController.getLogin);

router.post('/login', userController.postLogin);

router.post('/logout', userController.postLogout);

router.get('/signup', userController.getSignup);

router.post('/signup', userController.postSignup);

router.get('/resetpassword', userController.getResetPassword);

router.post('/resetPassword', userController.postResetPassword);

module.exports = router;