const router = require('express').Router()
module.exports = router

router.use('/users', require('./users'));
router.use('/carts', require('./carts'));
router.use('/visitors', require('./visitors'));
router.use('/products', require('./product'));
router.use('/payments', require('./payments'));


router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
