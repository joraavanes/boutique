const { Router } = require('express');
const homeController = require('../controllers/homeController');

const router = module.exports = Router();

router.get('/', homeController.getHome);