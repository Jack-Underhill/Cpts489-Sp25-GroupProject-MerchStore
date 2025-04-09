const { DataTypes } = require('sequelize');
const sequelize = require('/lib/db');

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'customer',
        validate: {
            isIn: [['customer', 'admin']]
        }
    }
}, {
    timestamps: true
});

module.exports = User;