const {
    DataTypes
} = require('sequelize');
const sequelize = require('../config/sequelize');
const Customer = require('./customer');
const Concert = require('./concert');

const Buy = sequelize.define('buy', {
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    category:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
        notEmpty:true
        }
    }
});

Buy.removeAttribute('id');



module.exports = Buy;