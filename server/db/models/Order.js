const Sequelize = require('sequelize');
const db = require('../db');

const Order = db.define('order', {
    
}, {
    timestamps: true,
    createdAt: 'orderDate'
})

module.exports = Order;