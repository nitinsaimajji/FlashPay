const express = require('express');
const router = express.Router();
const passport = require('passport');
const productController = require('../controllers/productController');
const concertController=require('../controllers/concertController');
const bookingController=require('../controllers/bookingController');
const transactionController=require('../controllers/transactionController');

router.get('/', productController.product);
router.get('/transaction',passport.checkAuthentication,transactionController.transactions);
router.get('/concert', concertController.concert);
router.use('/booking',passport.checkAuthentication,require('./booking'));
router.use('/user',require('./user'));
router.use('/order', passport.checkAuthentication, require('./order'));
router.use('/cart', passport.checkAuthentication, require('./cart'));
router.use('/buy', passport.checkAuthentication, require('./buy'));
router.use('/bank',passport.checkAuthentication,require('./bank'))

router.get('/music',(req,res)=>{
    res.render('music')
});






module.exports = router;