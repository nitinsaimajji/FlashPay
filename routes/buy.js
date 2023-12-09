const express = require('express');
const router = express.Router();
const buyController = require('../controllers/buyController');
const passport = require('passport');



router.get('/add', buyController.add);
router.get('/remove', buyController.remove);
router.get('/destroy', buyController.destroy);
router.get('/bookAll', buyController.buyAll);
router.get('/bookAll_credit',buyController.buyAll_credit);
router.get('/book', buyController.buy);
router.get('/c_add',buyController.c_add);
router.get('/buy_choose',(req,res)=>{
    res.render('buy_choose')
});
router.get('/check',(req,res)=>{
    res.render('event_single')
});
module.exports = router;