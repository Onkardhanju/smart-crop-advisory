const express = require('express');
const router = express.Router();
const { getWeather, getForecast } = require('../controllers/weatherController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/:location', getWeather);
router.get('/forecast/:location', getForecast);

module.exports = router;