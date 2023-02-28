const router = require('express').Router();
const {Product, User, Cart} = require('../db');

// get all products
router.get('/', async (req, res, next) => {
    try{
        // set page to the query, or default to 1
        const page = req.query.page || 1;
        // set the perPage limit to the query, or default to 20
        const perPage = req.query.perPage || 20;

        // calculate the offset
        const offset = (page - 1) * perPage;

        // get all the products
        res.json(await Product.findAll({
            offset,
            limit: perPage,
        }));
    } catch (err) {
        next(err);
    }
});

// get single product
router.get('/:productId', async (req, res, next) => {
    try{
        res.json(await Product.findByPk(req.params.productId));
    } catch(err) {
        next(err);
    }
})

module.exports = router;