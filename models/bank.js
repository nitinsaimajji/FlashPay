const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Bank = sequelize.define('bank', {
   creditCardNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  cardHolderName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  expiryMonth: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true,
      min: 1,
      max: 12
    }
  },
  expiryYear: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  cvv: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  creditAmount: {
    type: DataTypes.FLOAT,
    defaultValue:0
  }
});

Bank.removeAttribute('id');

module.exports = Bank;