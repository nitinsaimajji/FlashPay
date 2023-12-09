const {
  Op
} = require("sequelize");
const sequelize = require('sequelize');
const Order = require('../models/order');
const Cart = require('../models/cart');
const Product = require('../models/product');
const Customer = require('../models/customer');
const Bank=require('../models/bank');
const Transaction = require("../models/transaction");




module.exports.order = (req, res) => {
  Order.findAll({
      attributes: ['order_id', 'quantity', 'completion', 'paymentMode', 'paymentDate', 'product_id'],
      where: {
        customerId: req.user.id
      },
      order: [
        ['order_id', 'DESC']
      ],
      raw: true
    })
    .then(async orders => {

      for (let order of orders) {
        await Product.findByPk(order.product_id, {
            attributes: ['title', 'price', 'discount', 'image'],
            raw: true
          })
          .then(productData => {
            order.title = productData.title,
              // order.price = productData.price * (100 - productData.discount) / 100 * order.quantity,
              order.price = parseFloat((productData.price * (100 - productData.discount) / 100) * order.quantity)
            order.image = productData.image
          })
          .catch(err => console.log(err));
      }

      return res.render('order', {
        title: "Orders",
        orders: orders,
      });
    })
    .catch();
}

module.exports.orderOne = (req, res) => {
  Order.create({
      customerId: req.user.id,
      product_id: req.query.product_id
    })
    .then(() => res.redirect('/order'))
    .catch(err => console.log(err));
}


module.exports.orderAll = async (req, res) => {
  let totalPrice = 0;
  let balance = 0;
  try {
    // Retrieve the cart items for the current user
    const cartItems = await Cart.findAll({
      attributes: ['product_id', 'quantity'],
      where: {
        customerId: req.user.id
      },
      raw: true,
    });

    // Calculate the total price of the order
    for (let item of cartItems) {
      const product = await Product.findOne({
        attributes: ['price', 'discount'],
        where: {
          product_id: item.product_id
        },
        raw: true,
      });
      // totalPrice += product.price * item.quantity;
      totalPrice += parseFloat((product.price * (100 - product.discount) / 100) * item.quantity)
    }


    const customer = await Customer.findOne({
      where: {
        id: req.user.id
      },
    });
    customer.account -= totalPrice;

    if (customer.account < 0) {
      customer.account += totalPrice
      totalPrice = totalPrice.toFixed(2)
      return res.render('error', {
        a: totalPrice,
        b: customer.account
      })
    }

    balance = customer.account;
    await customer.save();

    // Create an order for each cart item


    for (let item of cartItems) {
      await Order.create({
        customerId: req.user.id,
        quantity: item.quantity,
        product_id: item.product_id
      });

      // console.log(item)
      // Remove the cart item

      await Cart.destroy({
        where: {
          [Op.and]: [{
            customerId: req.user.id
          }, {
            product_id: item.product_id
          }]
        },
      });

      // Decrement the quantity of the product
      await Cart.decrement('quantity', {
        by: item.quantity,
        where: {
          product_id: item.product_id
        }
      });
    }


    await Transaction.create({
      customerId: req.user.id,
      Amount: totalPrice,
      Description: 'Shop',
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
      b: balance
    });
  }
};



module.exports.orderAll_credit = async (req, res) => {
  let totalPrice = 0;
  let balance = 0;
  try {
    // Retrieve the cart items for the current user
    const cartItems = await Cart.findAll({
      attributes: ['product_id', 'quantity'],
      where: {
        customerId: req.user.id
      },
      raw: true,
    });

    // Calculate the total price of the order
    for (let item of cartItems) {
      const product = await Product.findOne({
        attributes: ['price', 'discount'],
        where: {
          product_id: item.product_id
        },
        raw: true,
      });
      // totalPrice += product.price * item.quantity;
      totalPrice += parseFloat((product.price * (100 - product.discount) / 100) * item.quantity)
    }


    const bank = await Bank.findOne({
      where: {
        customerId: req.user.id
      }
    });
    bank.creditAmount += totalPrice;

    await bank.save();
    balance = bank.creditAmount;
    

    // Create an order for each cart item


    for (let item of cartItems) {
      await Order.create({
        customerId: req.user.id,
        quantity: item.quantity,
        product_id: item.product_id,
        paymentMode: 'Credit Card'
      });

      // console.log(item)
      // Remove the cart item

      await Cart.destroy({
        where: {
          [Op.and]: [{
            customerId: req.user.id
          }, {
            product_id: item.product_id
          }]
        },
      });

      // Decrement the quantity of the product
      await Cart.decrement('quantity', {
        by: item.quantity,
        where: {
          product_id: item.product_id
        }
      });
    }

    await Transaction.create({
      customerId: req.user.id,
      Amount: totalPrice,
      Description: 'Shop',
      paymentMode: 'Credit Card'
    });


    return res.render('payment_credit', {
      a: totalPrice,
      b: balance,
      c:'Credit Card'
    });
  } catch (err) {
    console.error(err);
    return res.render('error', {
      a: totalPrice,
      b: balance,
      c:'Credit Card'
    });
  }
};