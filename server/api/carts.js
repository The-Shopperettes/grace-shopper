const router = require('express').Router();
const {Product, User, Cart, CartItem, Order} = require('../db').models;


//get the cart of a single user
router.get('/:id', async (req, res, next) => {
    try {
        //get the users' cart, including the cart items and associated products
        const userId = req.params.id;
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

//update user's cart
router.put('/:id', async (req, res, next) => {

})




module.exports = router;