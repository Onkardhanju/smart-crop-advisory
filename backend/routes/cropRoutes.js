const express = require('express');
const router = express.Router();
const { getCrops, getCropsByFarm, createCrop, updateCrop, deleteCrop } = require('../controllers/cropController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All crop routes are protected

router.get('/', getCrops);
router.get('/farm/:farmId', getCropsByFarm);
router.post('/', createCrop);
router.put('/:id', updateCrop);
router.delete('/:id', deleteCrop);

module.exports = router;