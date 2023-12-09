const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const passport = require('passport');



router.get('/', bookingController.bookings);

router.get('/destroy', bookingController.destroy);

module.exports = router;