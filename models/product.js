const {
    DataTypes
} = require('sequelize');
const sequelize = require('../config/sequelize');
const Order = require('./order');

const Product = sequelize.define('product', {
    product_id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    price: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    discount: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    description:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
}, 
{
    freezeTableName: true,
    timestamps: false
});


Product.hasMany(Order, {
    foreignKey: {
        name: 'product_id',
        allowNull: false
    }
});

Order.belongsTo(Product, {
    foreignKey: {
        name: 'product_id',
        allowNull: false
    }
});


module.exports=Product;
