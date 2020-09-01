const express = require('express');
const router = express.Router();
const errorController = require('../controllers/errorController');

router.get('/404', errorController.get404);

router.get(errorController.get404);

router.get(errorController.getServerError);

module.exports = router;