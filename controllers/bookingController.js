const { Op } = require("sequelize");
const Buy = require('../models/buy');
const Concert = require('../models/concert');
const Booking = require('../models/booking')

module.exports.bookings= (req, res) => {
    Booking.findAll({
            attributes: ['booking_id','quantity', 'completion', 'paymentMode', 'paymentDate','concert_id','totalAmount','category'],
            where: {
                customerId: req.user.id
            },
            order: [
                ['concert_id']
            ],
            raw: true
        })
        .then(async orders => {

            for (let order of orders) {
                await Concert.findByPk(order.concert_id, {
                        attributes: ['image','description','title'],
                        raw: true
                    })
                    .then(productData => {
                            order.image = productData.image,
                            order.description=productData.description,
                            order.title=productData.title
                    })
                    .catch(err => console.log(err));
            }

            return res.render('booking', {
                title: "Orders",
                orders: orders
            });
        })
        .catch();
}




module.exports.destroy = (req, res) => {
  req.flash('alert', 'Discarded');
  return Booking.destroy({
          where: {
              [Op.and]: [{
                      customerId: req.user.id
                  },
                  {
                      booking_id: req.query.booking_id
                  }
              ]
          }
      })
      .then(() => res.redirect('back'))
      .catch(err => console.log(err));
}