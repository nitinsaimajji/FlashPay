const { Op } = require("sequelize");
const Transaction = require("../models/transaction");

module.exports.transactions= (req, res) => {
    Transaction.findAll({
            where: {
                customerId: req.user.id
            },
            order: [
                ['transaction_id','DESC']
            ],
            raw: true
        })
        .then(async transactions => {
            return res.render('transaction', {
                transactions: transactions
            });
        })
        .catch();
}
