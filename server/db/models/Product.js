const Sequelize = require('sequelize');
const db = require('../db');

const Product = db.define('product', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    scientificName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    cycle: {
        type: Sequelize.STRING
    },
    watering: {
        type: Sequelize.STRING
    },
    sunlight: {
        type: Sequelize.STRING
    },
    largeImg: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isUrl: true
        }
    },
    mediumImg: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isUrl: true
        }
    },
    thumbnail: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isUrl: true
        }
    },
    qty: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
            min: 0
        }
    },
    price: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
            min: 0.5
        }
    }
});

module.exports = Product;