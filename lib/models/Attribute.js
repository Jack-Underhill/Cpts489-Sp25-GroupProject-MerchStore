const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Attribute = sequelize.define('Attribute', {
    name: DataTypes.STRING,
    type: DataTypes.STRING
}, {
    timestamps: false
});

module.exports = Attribute;