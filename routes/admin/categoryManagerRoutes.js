const router = require('express').Router();
const categoryManager = require('../../controllers/admin/categoryManagerController');

router.get('/', categoryManager.getCategories);

module.exports = router;