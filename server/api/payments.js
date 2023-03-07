const router = require('express').Router();

const stripe = require('stripe')(process.env.STRIPE_KEY);

const calculatePrice = (cartItems) => {
    return cartItems.reduce((sum, {product, qty}) => {
        return sum + (product.price * qty);
    }, 0)
}

router.post('/create-payment-intent', async (req, res, next) => {
    try {
      
        const {cartItems} = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: calculatePrice(cartItems),
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true
            }
        });

        res.send({
            clientSecret: paymentIntent.client_secret
        })
    } catch (err) {
        next(err);
    }

})

module.exports = router;