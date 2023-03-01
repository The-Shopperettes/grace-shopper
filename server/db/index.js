
const db = require('./db')

const User = require('./models/User');
const Cart = require('./models/Cart');
const Product = require('./models/Product');
const Order = require('./models/Order');
const CartItem = require('./models/CartItem');
const Visitor = require('./models/Visitor');

//Associations

User.hasOne(Cart);
Cart.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

Order.hasMany(CartItem);
CartItem.hasOne(Order);

CartItem.belongsTo(Cart);
Cart.hasMany(CartItem);

Product.hasMany(CartItem);
CartItem.belongsTo(Product);

Visitor.hasOne(Cart);
Cart.belongsTo(Visitor);

module.exports = {
  db,
  models: {
    User,
    Cart,
    Product,
    Order,
    CartItem,
    Visitor
  },
}
