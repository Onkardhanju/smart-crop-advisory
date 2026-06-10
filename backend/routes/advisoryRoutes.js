const express = require('express');
const router = express.Router();
const { askAdvisory, getAdvisoryHistory } = require('../controllers/advisoryController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/ask', askAdvisory);
router.get('/history', getAdvisoryHistory);

module.exports = router;