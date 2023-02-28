const Sequelize = require('sequelize');
const db = require('../db');

const CartItem = db.define('cartItems', {
    qty: {
        type: Sequelize.INTEGER,
        validate: {
            min: 1
        }
    }
});

module.exports = CartItem;