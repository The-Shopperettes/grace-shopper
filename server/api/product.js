const router = require('express').Router();
const {Product, User, Cart} = require('../db');

// get all products
router.get('/', async (req, res, next) => {
    try{
        res.json(await Product.findAll());
    } catch (err) {
        next(err);
    }
});

// TODO: single product


module.exports = router;