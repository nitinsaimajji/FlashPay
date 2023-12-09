const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const passport = require('passport');

router.get('/', orderController.order);


router.get('/orderAll', orderController.orderAll);
router.get('/orderAll_credit', orderController.orderAll_credit);

router.get('/order_choose',(req,res)=>{
    res.render('order_choose');
});
module.exports = router;