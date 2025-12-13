const express = require('express');
const sweetController = require('../controllers/sweet.controller');
const { protect } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/admin.middleware');

const router = express.Router();

router.post('/', protect, isAdmin, sweetController.createSweet);
router.get('/', protect, isAdmin, sweetController.getAllSweets);
router.put('/:id', protect, isAdmin, sweetController.updateSweet);
router.delete('/:id', protect, isAdmin, sweetController.deleteSweet);
router.get('/search', protect, sweetController.searchSweets);
router.post('/:id/purchase', protect, sweetController.purchaseSweet);

module.exports = router;
