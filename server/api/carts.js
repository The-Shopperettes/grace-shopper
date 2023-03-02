const router = require('express').Router();
const {Product, User, Cart, CartItem, Order, Visitor} = require('../db').models;


//auth middleware
const getToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if(token) {
            const user = await User.findByToken(token);
            req.user = user;

        } else {
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

            let visitor = await Visitor.findOne({
                where: {token: ip}
            });

            if(!visitor) visitor = await Visitor.create({token: ip});

            req.visitor = visitor;

        }

        next();
    } catch (err) {
        next(err);
    }
  }

  //auth middleware
  const authenticateCartItem = async (req, res, next) => {
    try {
        
        //get the user/visitor, check that the cart item belongs to that userg, unless an admin
        
        if(!(req.user && req.user.isAdmin)) {
            const {itemId} = req.params;

            const cartItem = await CartItem.findByPk(itemId);

            const search = req.user ? {userId: req.user.id} : {visitorId: req.visitor.id};

            const cart = await Cart.findOne({
                where: search
            });

            if(cartItem.cartId !== cart.id) throw new Error('Not authorized');
        }
        next();

    } catch (err) {
        next(err);
    }
  }

//get the cart of a single user
router.get('/', getToken, async ({visitor, user}, res, next) => {
    try {
    
        let search = {};
        //get the user or visitor's cart
        if(user) {
            search = {userId: user.id};
        } else {
            search = {visitorId: visitor.id}
        }

        const cart = await Cart.findOne({
            where: search,
            include: {
                model: CartItem,
                include: [ Product ]
            },
            order: [[CartItem, 'id', 'DESC']]
        })

        res.send(cart);

    } catch (err) {
        next(err);
    }
})

//update qty of item in user's cart, sends back new cart
router.put('/item/:itemId', getToken, authenticateCartItem, async (req, res, next) => {
    try {
        const { itemId } = req.params;
        const update = {qty: Number(req.body.qty)}

        if(isNaN(update.qty)) throw new Error('Qty must be a number');

        //update the item
        await CartItem.update(update, {
            where: {id: itemId}
        })

        res.status(201).send();

    } catch (err) {
        next(err);
    }
})

router.delete(`/item/:itemId`, getToken, authenticateCartItem, async (req, res, next) => {
    try {  
        const { itemId } = req.params;

        await CartItem.destroy({where: {id: itemId}});

        res.status(204).send();

    } catch (err) {
        next(err);
    }
})




module.exports = router;