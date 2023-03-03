const Sequelize = require('sequelize');
const db = require('../db');

const Order = db.define('order', {
    email: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
            isEmail: true
        }
    }
}, {
    timestamps: true,
    createdAt: 'orderDate'
})

module.exports = Order;