const express = require('express');
const router = express.Router();
const bankController = require('../controllers/bankController');
const passport = require('passport');

router.post('/create', bankController.create);
router.get('/check',bankController.check);

module.exports=router;