const {
    DataTypes
} = require('sequelize');
const sequelize = require('../config/sequelize');

const Booking = sequelize.define('booking', {
    booking_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    completion: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    paymentMode: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'online Account payment'
    },
    paymentDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Silver'
    },
    totalAmount: {
        type: DataTypes.DECIMAL(8,2),
        allowNull: false,
        defaultValue: 0
    }
}, {
    initialAutoIncrement: 1000000,
});

module.exports = Booking;