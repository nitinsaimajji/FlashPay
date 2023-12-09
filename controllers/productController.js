const {
    Op
} = require("sequelize");
const Product = require('../models/product');
const Cart = require('../models/cart');

module.exports.product = (req, res) => {
    Product.findAll({
            attributes: ['product_id', 'title', 'price', 'discount', 'description', 'image'],
            raw: true
        })
        .then(async products => {
            for (let product of products) {
                if (!(req.user == undefined)) {
                    await Cart.findOne({
                            where: {
                                [Op.and]: [{
                                        customerId: req.user.id
                                    },
                                    {
                                        product_id: product.product_id
                                    }
                                ]
                            },
                            raw: true
                        })
                        .then(cartInfo => {
                            if (cartInfo == null)
                                product.addedToCart = false;
                            else
                                product.addedToCart = true;

                        })
                        .catch(err => console.log(err));
                }
            }
            return products;
        })
        .then(products => {
            return res.render('home', {
                title: "Home",
                products: products
            });
        })
        .catch(err => console.log(err));
}
