const router = require("express").Router();
const { Product, User, Cart, CartItem, Order, Visitor } =
  require("../db").models;

//auth middleware
const getToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (token) {
      const user = await User.findByToken(token);
      req.user = user;

    } else {
      const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

      let visitor = await Visitor.findOne({
        where: { token: ip },
      });

      if (!visitor) visitor = await Visitor.create({ token: ip });

      req.visitor = visitor;
    }

    next();
  } catch (err) {
    next(err);
  }
};

//auth middleware
const authenticateCartItem = async (req, res, next) => {
  try {
    //get the user/visitor, check that the cart item belongs to that userg, unless an admin

    if (!(req.user && req.user.isAdmin)) {
      const { itemId } = req.params;

      const cartItem = await CartItem.findByPk(itemId);

      const search = req.user
        ? { userId: req.user.id }
        : { visitorId: req.visitor.id };

      const cart = await Cart.findOne({
        where: search,
      });

      if (cartItem.cartId !== cart.id) throw new Error("Not authorized");
    }
    next();
  } catch (err) {
    next(err);
  }
};

//get the cart of a single user
router.get("/", getToken, async ({ visitor, user }, res, next) => {
  try {
    let search = {};
    //get the user or visitor's cart
    if (user) {
      search = { userId: user.id };
    } else {
      search = { visitorId: visitor.id };
    }

    let cart = await Cart.findOne({
      where: search,
      include: {
        model: CartItem,
        include: [Product],
      },
      order: [[CartItem, "id", "DESC"]],
    });

    let upToDate = true;

    await Promise.all(
      cart.cartItems.map((item) => {
        if (item.qty > item.product.qty) {
          item.update({ qty: item.product.qty });
          upToDate = false;
        }
      })
    );

    //refetch if not up to date
    if (!upToDate) {
      cart = await Cart.findOne({
        where: search,
        include: {
          model: CartItem,
          include: [Product],
        },
        order: [[CartItem, "id", "DESC"]],
      });
    }

    res.send(cart);
  } catch (err) {
    next(err);
  }
});

//add item to cart
router.post("/item/add", getToken, async (req, res, next) => {
  try {
    //get the product id
    const { productId, qty } = req.body;

    //get the user's cart
    const search = req.user
      ? { userId: req.user.id }
      : { visitorId: req.visitor.id };

    const cart = await Cart.findOne({ where: search, include: CartItem });

    const item = cart.cartItems.find(
      ({ productId: id }) => id === Number(productId)
    );

    if (!item) {
      await CartItem.create({
        cartId: cart.id,
        productId,
        qty,
      });
    } else {
      await item.update({ qty: item.qty + qty });
    }

    res.status(201).send();
  } catch (err) {
    next(err);
  }
});

router.put("/transfer", getToken, async (req, res, next) => {
  try {
    //if there's no user, return an error
    if (!req.user) throw new Error("Issue transfering");

    //get the visitorIp
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    //get the visitor's cart
    let visitor = await Visitor.findOne({
      where: { token: ip },
      include: {
        model: Cart,
        include: CartItem
      }
    });

    if(!visitor.cart) throw new Error('Cart not found');

    //transfer the cart items
    //can't just transfer the cart because the user may have an existing cart
    const userCart = await Cart.findOne({where: {userId: req.user.id}});

    await userCart.addCartItems(visitor.cart.cartItems);

    await Promise.all([visitor.destroy(), visitor.cart.destroy()]);

    res.status(201).send();

  } catch (err) {
    next(err);
  }
});

//update qty of item in user's cart, sends back new cart
router.put(
  "/item/:itemId",
  getToken,
  authenticateCartItem,
  async (req, res, next) => {
    try {
      const { itemId } = req.params;
      const update = { qty: Number(req.body.qty) };

      if (isNaN(update.qty)) throw new Error("Qty must be a number");

      //update the item
      await CartItem.update(update, {
        where: { id: itemId },
      });

      res.status(201).send();
    } catch (err) {
      next(err);
    }
  }
);

router.put("/order", getToken, async (req, res, next) => {
  try {
    //create order and assign cart items to that order, assign user to order
    const order = await Order.create();

    const cartId = req.user ? req.user.cartId : req.visitor.cartId;

    const cart = await Cart.findByPk(cartId, {
      include: CartItem,
    });

    await order.addCartItems(cart.cartItems);

    await cart.destroy();

    const newCartData = req.user
      ? { userId: req.user.id }
      : { visitorId: req.visitor.id };

    await Cart.create(newCartData);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

router.delete(
  `/item/:itemId`,
  getToken,
  authenticateCartItem,
  async (req, res, next) => {
    try {
      const { itemId } = req.params;

      await CartItem.destroy({ where: { id: itemId } });

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
