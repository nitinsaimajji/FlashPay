const {
    DataTypes
} = require('sequelize');
const sequelize = require('../config/sequelize');
const Order = require('./order');
const Booking = require('./booking');
const Concert = require('./concert');
const Buy = require('./buy');
const Bank=require('./bank');
const Transaction = require('./transaction');

const Customer = sequelize.define('customer', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    phoneNo: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    account: {
        type: DataTypes.FLOAT,
        defaultValue: 20000
    }
});

//relationships :

Customer.hasMany(Order, {
    foreignKey: {
        allowNull: false
    }
});

Order.belongsTo(Customer, {
    foreignKey: {
        allowNull: false
    }
});


Customer.hasMany(Transaction, {
    foreignKey: {
        allowNull: false
    }
});

Transaction.belongsTo(Customer, {
    foreignKey: {
        allowNull: false
    }
});


Customer.hasMany(Booking, {
    foreignKey: {
        allowNull: false
    }
});

Booking.belongsTo(Customer, {
    foreignKey: {
        allowNull: false
    }
});

Customer.belongsToMany(Concert, {
    through: Buy,
    foreignKey: {
        name: 'customerId',
        allowNull: false
    }
});

Concert.belongsToMany(Customer, {
    through: Buy,
    foreignKey: {
        name: 'concert_id',
        allowNull: false
    }
});


Customer.hasOne(Bank, {
    foreignKey: {
        name: 'customerId',
        allowNull: false
    }
});

Bank.belongsTo(Customer, {
    foreignKey: {
        name: 'customerId',
        allowNull: false
    }
});




module.exports = Customer;