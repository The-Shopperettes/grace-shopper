
const db = require('./db')

const User = require('./models/User');
const Cart = require('./models/Cart');
const Product = require('./models/Product');
const Order = require('./models/Order');

//Associations

Product.belongsToMany(Cart, {through: "Carts_Products"});
Cart.belongsToMany(Product, {through: "Carts_Products"});

User.hasOne(Cart);
Cart.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

Order.belongsToMany(Product, {through: 'Orders_Products'});
Product.belongsToMany(Order, {through: 'Orders_Products'});

module.exports = {
  db,
  models: {
    User,
    Cart,
    Product,
    Order
  },
}
