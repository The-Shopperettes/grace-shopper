const Sequelize = require('sequelize');
const db = require('../db');
const Cart = require('./Cart');

const Visitor = db.define('visitor', {
    token: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
})

//automatically create an empty cart for the user
const initCart = async({id}) => {
    await Cart.create({
        visitorId: id
    });
}

Visitor.afterCreate(initCart);

module.exports = Visitor;