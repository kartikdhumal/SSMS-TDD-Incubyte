const express = require('express');
const sweetController = require('../controllers/sweet.controller');
const { protect } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/admin.middleware');

const router = express.Router();

router.post('/', protect, isAdmin, sweetController.createSweet);
router.get('/', protect, isAdmin, sweetController.getAllSweets);

module.exports = router;
