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
            }
        })

        res.send(cart);

    } catch (err) {
        next(err);
    }
})

//update qty of item in user's cart
router.put('/item/:itemId', async (req, res, next) => {
    try {
        const { itemId: id } = req.params;
        const update = {qty: Number(req.body.qty)}
        if(isNaN(update.qty)) throw new Error('Qty must be a number');

        //to do: make sure it's the right user!

        //update the item
        await CartItem.update(update, {
            where: {id}
        })

        //send back the updated cart
        res.status(201).send();

    } catch (err) {
        next(err);
    }
})




module.exports = router;