const {
    DataTypes
} = require('sequelize');
const sequelize = require('../config/sequelize');
const Booking = require('./booking');

const Concert = sequelize.define('concert', {
    concert_id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    price: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        validate: {
            notEmpty: true
        }
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
    },
    total_tickets:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
}, 
{
    freezeTableName: true,
    timestamps: false
}
);


Concert.hasMany(Booking, {
    foreignKey: {
        name: 'concert_id',
        allowNull: false
    }
});

Booking.belongsTo(Concert, {
    foreignKey: {
        name: 'concert_id',
        allowNull: false
    }
});


module.exports=Concert;
