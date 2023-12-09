const {
    DataTypes
} = require('sequelize');
const sequelize = require('../config/sequelize');

const Transaction = sequelize.define('transaction', {
    transaction_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    paymentMode: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Wallet Payment'
    },
    Description: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'online Account payment'
    },
    Amount: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
        defaultValue: 0
    },
    type:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Debited'
    }
}, {
    initialAutoIncrement: 9900,
});

module.exports = Transaction;