const express = require('express');
const router = express.Router();

const userManagerController = require('../../controllers/admin/userManagerController');

router.get('/', userManagerController.getUsers);

module.exports = router;