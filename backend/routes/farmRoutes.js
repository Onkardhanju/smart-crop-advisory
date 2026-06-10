const express = require('express');
const router = express.Router();
const { getFarms, createFarm, updateFarm, deleteFarm } = require('../controllers/farmController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All farm routes are protected

router.get('/', getFarms);
router.post('/', createFarm);
router.put('/:id', updateFarm);
router.delete('/:id', deleteFarm);

module.exports = router;