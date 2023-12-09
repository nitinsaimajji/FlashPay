const { Op } = require("sequelize");
const Bank = require('../models/bank');

module.exports.check=(req,res)=>{
    const customerId=req.user.id;
    Bank.findOne({ where: { customerId } })
    .then(existingBank => {
      if (existingBank) {
        req.flash('success', `Your Card Balance is ₹ ${existingBank.creditAmount}`);
        return res.redirect('back');
      } else{
        return res.render('credit_card');
      }
    });
}

module.exports.create = (req, res) => {
  const customerId = req.user.id;

  // Check if a bank record already exists for the customer
  Bank.findOne({ where: { customerId } })
    .then(existingBank => {
      if (existingBank) {
        req.flash('error', 'Bank details already exist');
        return res.redirect('back');
      } else {
        const { creditCardNumber, cardHolderName, expiryMonth, expiryYear, cvv } = req.body;
        // Create a new bank record
        Bank.create({
          creditCardNumber,
          cardHolderName,
          expiryMonth,
          expiryYear,
          cvv,
          customerId
        })
          .then(() => {
            req.flash('success', 'Bank details saved');
            return res.redirect('/');
          })
          .catch(err => {
            console.log(err);
            req.flash('error', 'An error occurred');
            return res.send('unsuccessful');
          });
      }
    })
    .catch(err => {
      console.log(err);
      req.flash('error', 'An error occurred');
      return res.redirect('back');
    });
};
