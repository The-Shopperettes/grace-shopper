const router = require('express').Router();
const {Product, User, Cart, CartItem, Order} = require('../db').models;


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
router.put('/:itemId/qty', async (req, res, next) => {
    try {
        const { itemId: id } = req.params;
        const {qty} = req.body;
        
        //to do: make sure it's the right user!

        //update the item
        const item = await CartItem.update({qty}, {
            where: {id}
        })

        //send back the updated cart
        res.send(await Cart.findByPk(item.cartId));

    } catch (err) {
        next(err);
    }
})




module.exports = router;