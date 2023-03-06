const router = require('express').Router();

const stripe = require('stripe')('sk_test_51MiLhrLln7p5YtECleFFOiC44eWTgEudZkyTslOjDzUHcyzyOPAlCJAvqOo10hbIh8VI6GQAW4GPv9lq9tmLBqBi00R19JMHFd');

const calculatePrice = (cartItems) => {

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