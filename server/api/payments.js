const router = require('express').Router();

const stripe = require('stripe')('sk_test_51MiLhrLln7p5YtECleFFOiC44eWTgEudZkyTslOjDzUHcyzyOPAlCJAvqOo10hbIh8VI6GQAW4GPv9lq9tmLBqBi00R19JMHFd');

const endpointSecret = 'whsec_...';

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

router.post('/webhook', async (req, res, next) => {
    let event = request.body;
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    console.log(event, 'EVENT');
    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = request.headers['stripe-signature'];
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          endpointSecret
        );
      } catch (err) {
        console.log(`Webhook signature verification failed.`, err.message);
        return res.sendStatus(400);
      }
    }
  
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
        // Then define and call a method to handle the successful payment intent.
        // handlePaymentIntentSucceeded(paymentIntent);
        break;
      case 'payment_method.attached':
        const paymentMethod = event.data.object;
        console.log('Success!');
        break;
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }
  
    // Return a 200 response to acknowledge receipt of the event
    res.send();
  });

module.exports = router;