const {
    DataTypes
} = require('sequelize');
const sequelize = require('../config/sequelize');
const Product = require('./product');
const Customer = require('./customer');

const Cart = sequelize.define('cart', {
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
});

Cart.removeAttribute('id');

Customer.belongsToMany(Product, {
    through: Cart,
    foreignKey: {
        name: 'customerId',
        allowNull: false
    }
});

Product.belongsToMany(Customer, {
    through: Cart,
    foreignKey: {
        name: 'product_id',
        allowNull: false
    }
});

module.exports = Cart;