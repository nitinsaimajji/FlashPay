const {
    Op
} = require("sequelize");
const Concert = require('../models/concert');

module.exports.concert = (req, res) => {
    Concert.findAll({
            raw: true
        })
        .then(concerts => {
            return res.render('event', {                                                              //checked 
                title: "Concert",
                concerts: concerts
            });

        })
        .catch(err => console.log(err));
}
