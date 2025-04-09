const { DataTypes } = require('sequelize');
const sequelize = require('/lib/db');

const CartItem = sequelize.define('CartItem', {
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
            min: 1
        }
    }
}, {
    timestamps: true
});

module.exports = CartItem;