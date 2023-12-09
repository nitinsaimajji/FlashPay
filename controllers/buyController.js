const {
    Op
} = require("sequelize");
const Buy = require('../models/buy');
const Concert = require('../models/concert');
const Customer = require('../models/customer');
const Booking = require("../models/booking");
const Transaction=require('../models/transaction');
const Bank = require('../models/bank');
const {
    concert
} = require("./concertController");


// Buy :

module.exports.buy = (req, res) => {
    Buy.findAll({
            attributes: ['concert_id', 'quantity', 'category'],
            where: {
                customerId: req.user.id
            },
            raw: true
        })
        .then(async concerts => {
            let TotalPrice = 0;
            let Quantity = 0;
            for (let concert of concerts) {
                await Concert.findByPk(concert.concert_id, {
                        attributes: ['title', 'price', 'description', 'image', 'total_tickets'],
                        raw: true
                    })
                    .then(productData => {
                        price = productData.price;
                        category = concert.category;

                        if (category === "Silver") {
                            price = parseFloat(productData.price) + 200.00;
                        } else if (category === "Gold") {
                            price = parseFloat(productData.price) + 300.00;
                        } else if (category === "Platinum") {
                            price = parseFloat(productData.price) + 400.00;
                        }

                        tax = 15.20
                        
                        TotalPrice += parseFloat(price * concert.quantity + tax);
                        Quantity += concert.quantity;

                        concert.title = productData.title,
                            concert.price = productData.price,
                            concert.image = productData.image
                    })
                    .catch(err => console.log(err));
            }
            return res.render('buy', {
                title: "buy",
                concerts: concerts,
                TotalPrice: TotalPrice,
                Quantity: Quantity,
                category: category,
                tax: tax
            });
        })
        .catch(err => console.log(err));
}



//creates a entry in Buy table & Increments the quantity                <!-- 15th May 2023 -->

module.exports.add = (req, res) => {
    return Buy.findOrCreate({
            where: {
                [Op.and]: [{
                        customerId: req.user.id
                    },
                    {
                        concert_id: req.query.concert_id
                    }
                ]
            },
            defaults: {
                customerId: req.user.id,
                concert_id: req.query.concert_id,
                quantity: 0,
                category: "Silver"
            }
        })
        .then(() => {
            return Buy.increment('quantity', {
                by: 1,
                where: {
                    [Op.and]: [{
                            customerId: req.user.id
                        },
                        {
                            concert_id: req.query.concert_id
                        }
                    ]
                }
            });

        })
        .then(() => res.redirect('/buy/book'))
        .catch(err => console.log(err));
}





// updates category 

module.exports.c_add = (req, res) => {
    return Buy.findOrCreate({
            where: {
                [Op.and]: [{
                        customerId: req.user.id
                    },
                    {
                        concert_id: req.query.concert_id
                    }
                ]
            },
            defaults: {
                customerId: req.user.id,
                concert_id: req.query.concert_id,
            }
        })
        .then(() => {
            return Buy.update({
                category: req.query.category,
            }, {
                where: {
                    [Op.and]: [{
                        customerId: req.user.id
                    }, {
                        concert_id: req.query.concert_id
                    }]
                }
            })
        })
        .then(() => res.redirect('/buy/book/'))
        .catch(err => console.log(err));
}





// decrementing quantity

module.exports.remove = (req, res) => {
    Buy.findOne({
            attributes: ['quantity'],
            raw: true,
            where: {
                [Op.and]: [{
                        customerId: req.user.id
                    },
                    {
                        concert_id: req.query.concert_id
                    }
                ]
            }
        })
        .then(async buy => {
            if (buy.quantity > 1) {
                return Buy.decrement('quantity', {
                        by: 1,
                        where: {
                            [Op.and]: [{
                                    customerId: req.user.id
                                },
                                {
                                    concert_id: req.query.concert_id
                                }
                            ]
                        }
                    })
                    .then(() => res.redirect('back'))
                    .catch(err => console.log(err));
            } else {
                await req.flash('error', 'Discarded');
                return Buy.destroy({
                        where: {
                            [Op.and]: [{
                                    customerId: req.user.id
                                },
                                {
                                    concert_id: req.query.concert_id
                                }
                            ]
                        }
                    })
                    .then(() => res.redirect('/concert'))
                    .catch(err => console.log(err));
            }
        })
        .catch(err => console.log(err));
}


// Discarding data:


module.exports.destroy = (req, res) => {
    req.flash('alert', 'Discarded');
    return Buy.destroy({
            where: {
                [Op.and]: [{
                        customerId: req.user.id
                    },
                    {
                        concert_id: req.query.concert_id
                    }
                ]
            }
        })
        .then(() => res.redirect('/concert'))
        .catch(err => console.log(err));
}



// buy all

module.exports.buyAll = async (req, res) => {
    let totalPrice = 0;
    let balance = 0;
    try {
        // Retrieve the cart items for the current user
        const buyItems = await Buy.findAll({
            attributes: ['concert_id', 'quantity', 'category'],
            where: {
                customerId: req.user.id
            },
            raw: true,
        });

        // Calculate the total price of the order
        for (let item of buyItems) {
            const concert = await Concert.findOne({
                attributes: ['price', 'total_tickets'],
                where: {
                    concert_id: item.concert_id
                },
                raw: true,
            });
            const category = item.category;
            let price = concert.price;

            if (category === 'Silver') {
                price = parseFloat(concert.price) + 200.00;
            } else if (category === 'Gold') {
                price = parseFloat(concert.price) + 300.00;
            } else if (category === 'Platinum') {
                price = parseFloat(concert.price) + 400.00;
            }

            const tax = 15.20;

            totalPrice += parseFloat(price * item.quantity + tax);

            const total_tickets = concert.total_tickets - item.quantity;

            if (total_tickets < 0) {
                return res.send('Invalid Number of tickets');
            }

            await Concert.update({
                total_tickets: total_tickets
            }, {
                where: {
                    concert_id: item.concert_id
                }
            });
        }

        const customer = await Customer.findOne({
            where: {
                id: req.user.id
            },
        });
        customer.account -= totalPrice;

        if (customer.account < 0) {
            customer.account += totalPrice;
            totalPrice = totalPrice.toFixed(2);
            return res.render('error', {
                a: totalPrice,
                b: customer.account
            });
        }

        balance = customer.account;
        await customer.save();

        for (let item of buyItems) {
            await Booking.create({
                customerId: req.user.id,
                quantity: item.quantity,
                concert_id: item.concert_id,
                totalAmount: totalPrice,
                category: item.category
            });

            await Buy.destroy({
                where: {
                    [Op.and]: [{
                        customerId: req.user.id
                    }, {
                        concert_id: item.concert_id
                    }]
                },
            });

            await Buy.decrement('quantity', {
                by: item.quantity,
                where: {
                    concert_id: item.concert_id
                }
            });
        }

        await Transaction.create({
            customerId: req.user.id,
            Amount: totalPrice,
            Description: 'Concert',
            paymentMode: 'Wallet'
        });

        return res.render('payment', {
            a: totalPrice,
            b: balance,
            c:'Wallet'
        });
    } catch (err) {
        console.error(err);
        return res.render('error', {
            a: totalPrice,
            b: balance,
            c:'Wallet'
        });
    }
};



module.exports.buyAll_credit = async (req, res) => {
    let totalPrice = 0;
    let balance = 0;
    try {
        // Retrieve the cart items for the current user
        const buyItems = await Buy.findAll({
            attributes: ['concert_id', 'quantity', 'category'],
            where: {
                customerId: req.user.id
            },
            raw: true,
        });

        // Calculate the total price of the order
        for (let item of buyItems) {
            const concert = await Concert.findOne({
                attributes: ['price', 'total_tickets'],
                where: {
                    concert_id: item.concert_id
                },
                raw: true,
            });
            const category = item.category;
            let price = concert.price;

            if (category === 'Silver') {
                price = parseFloat(concert.price) + 200.00;
            } else if (category === 'Gold') {
                price = parseFloat(concert.price) + 300.00;
            } else if (category === 'Platinum') {
                price = parseFloat(concert.price) + 400.00;
            }

            const tax = 15.20;

            totalPrice += parseFloat(price * item.quantity + tax);

            const total_tickets = concert.total_tickets - item.quantity;

            if (total_tickets < 0) {
                return res.send('Invalid Number of tickets');
            }

            await Concert.update({
                total_tickets: total_tickets
            }, {
                where: {
                    concert_id: item.concert_id
                }
            });
        }

        const bank = await Bank.findOne({
            where: {
                customerId: req.user.id
            }
        });
        bank.creditAmount -= totalPrice;

        if (bank.creditAmount < 0) {
            bank.creditAccount += totalPrice;
            totalPrice = totalPrice.toFixed(2);
            return res.render('error', {
                a: totalPrice,
                b: bank.creditAccount
            });
        }

        balance = bank.creditAmount;
        await bank.save();

        for (let item of buyItems) {
            await Booking.create({
                customerId: req.user.id,
                quantity: item.quantity,
                concert_id: item.concert_id,
                totalAmount: totalPrice,
                category: item.category,
                paymentMode: 'Credit Card'
            });

            await Buy.destroy({
                where: {
                    [Op.and]: [{
                        customerId: req.user.id
                    }, {
                        concert_id: item.concert_id
                    }]
                },
            });

            await Buy.decrement('quantity', {
                by: item.quantity,
                where: {
                    concert_id: item.concert_id
                }
            });
        }

        await Transaction.create({
            customerId: req.user.id,
            Amount: totalPrice,
            Description: 'Concert',
            paymentMode: 'Credit Card'
        });

        return res.render('payment', {
            a: totalPrice,
            b: balance,
            c:'Credit Card'
        });
    } catch (err) {
        console.error(err);
        return res.render('payment', {
            a: totalPrice,
            b: balance,
            c:'Credit Card'
        });
    }
};