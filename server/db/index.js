//this is the access point for all things database related!

const db = require('./db')

const User = require('./models/User');
const Cart = require('./models/Cart');
const Product = require('./models/Product');

//associations could go here!

Product.belongsToMany(Cart, {through: "Carts_Products"});
Cart.belongsToMany(Product, {through: "Carts_Products"});

User.hasOne(Cart);
Cart.belongsTo(User);

module.exports = {
  db,
  models: {
    User,
    Cart,
    Product
  },
}
