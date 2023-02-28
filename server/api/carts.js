const router = require('express').Router();
const {Product, User, Cart, CartItem, Order} = require('../db').models;


//auth middleware
const requireToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if(!token) throw new Error('Not authorized');
        const user = await User.findByToken(token);
        if(!user) throw new Error('User not found');
        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
  }

//get the cart of a single user
router.get('/:userId', async (req, res, next) => {
    try {
        //get the users' cart, including the cart items and associated products
        const {userId} = req.params;

        //to do: make sure it's the right user

        const cart = await Cart.findOne({
            where: {
                userId
            },
            include: {
                model: CartItem,
                include: Product
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