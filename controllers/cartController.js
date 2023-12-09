const {
    Op
} = require("sequelize");
const Cart = require('../models/cart');
const Product = require('../models/product');

module.exports.cart = (req, res) => {
    Cart.findAll({
            attributes: ['product_id', 'quantity'],
            where: {
                customerId: req.user.id
            },
            raw: true
        })
        .then(async products => {
            let cartTotalPrice = 0;
            let cartQuantity = 0;
            for (let product of products) {
                await Product.findByPk(product.product_id, {
                        attributes: ['title', 'price', 'discount','image'],
                        raw: true
                    })
                    .then(productData => {
                        cartTotalPrice += parseFloat((productData.price * (100 - productData.discount) / 100) * product.quantity);
                        cartQuantity += product.quantity;
                            product.title = productData.title,
                            product.price = productData.price,
                            product.discount = productData.discount,
                            product.image = productData.image
                    })
                    .catch(err => console.log(err));
            }
            return res.render('cart', {
                title: "Cart",
                products: products,
                cartTotalPrice: cartTotalPrice,
                cartQuantity: cartQuantity
            });
        })
        .catch(err => console.log(err));
}

module.exports.add = (req, res) => {
    return Cart.findOrCreate({
            where: {
                [Op.and]: [{
                        customerId: req.user.id
                    },
                    {
                        product_id: req.query.product_id
                    }
                ]
            },
            defaults: {
                customerId: req.user.id,
                product_id: req.query.product_id,
                quantity: 0
            }
        })
        .then(() => {
            return Cart.increment('quantity', {
                by: 1,
                where: {
                    [Op.and]: [{
                            customerId: req.user.id
                        },
                        {
                            product_id: req.query.product_id
                        }
                    ]
                }
            });

        })
        .then(() => res.redirect('back'))
        .catch(err => console.log(err));
}

module.exports.remove = (req, res) => {
    Cart.findOne({
            attributes: ['quantity'],
            raw: true,
            where: {
                [Op.and]: [{
                        customerId: req.user.id
                    },
                    {
                        product_id: req.query.product_id
                    }
                ]
            }
        })
        .then(async cart => {
            if (cart.quantity > 1) {
                return Cart.decrement('quantity', {
                        by: 1,
                        where: {
                            [Op.and]: [{
                                    customerId: req.user.id
                                },
                                {
                                    product_id: req.query.product_id
                                }
                            ]
                        }
                    })
                    .then(() => res.redirect('back'))
                    .catch(err => console.log(err));
            } else {
                req.flash('alert', 'Removed from cart');
                return Cart.destroy({
                        where: {
                            [Op.and]: [{
                                    customerId: req.user.id
                                },
                                {
                                    product_id: req.query.product_id
                                }
                            ]
                        }
                    })
                    .then(() => res.redirect('back'))
                    .catch(err => console.log(err));
            }
        })
        .catch(err => console.log(err));
}

module.exports.destroy = (req, res) => {
    req.flash('alert', 'Removed from cart');
    return Cart.destroy({
            where: {
                [Op.and]: [{
                        customerId: req.user.id
                    },
                    {
                        product_id: req.query.product_id
                    }
                ]
            }
        })
        .then(() => res.redirect('back'))
        .catch(err => console.log(err));
}