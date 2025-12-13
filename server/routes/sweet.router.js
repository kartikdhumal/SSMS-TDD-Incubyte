const express = require('express');
const sweetController = require('../controllers/sweet.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', protect, sweetController.createSweet);

module.exports = router;
