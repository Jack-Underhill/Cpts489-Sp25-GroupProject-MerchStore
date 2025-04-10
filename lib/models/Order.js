const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');

const Order = sequelize.define('Order', {
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    }
}, {
    timestamps: true
});

User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId', allowNull: false });

module.exports = Order;