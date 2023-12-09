const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const passport = require('passport');

router.get('/',(req,res)=>{
    res.send("local:host 5000 front page")
});

router.get('/profile',(req,res)=>{
    res.render('profile')
});

router.get('/pay',(req,res)=>{
    res.render('wallet')
});

router.get('/topUp',(req,res)=>{
    res.render('topUp')
});

router.get('/sign-up', userController.register);
router.get('/sign-in', userController.login);
router.post('/create', userController.create);
router.post('/update', userController.update);
router.post('/pay', userController.pay);
router.post('/topUp',userController.topUp);
router.post('/create-session', passport.authenticate('local', {
    failureRedirect: '/user/sign-in'
}), userController.createSession);
router.get('/sign-out', userController.destroySession);

module.exports = router;