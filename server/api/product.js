const router = require('express').Router();
const {Product} = require('../db').models;
const { requireAdmin } = require('./middleware');

// get all products
router.get('/', async (req, res, next) => {
    try{
        // set page to the query, or default to 1
        const page = req.query.page || 1;
        // set the perPage limit to the query, or default to 9
        const perPage = req.query.perPage || 9;

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

// get product count via Product.count
router.get('/count', async (req, res, next) => {
    try{
        res.json(await Product.count());
    } catch (err) {
        next(err);
    }
})

// get single product
router.get('/:id', async (req, res, next) => {
    try{
        res.send(await Product.findByPk(req.params.id));
    } catch(err) {
        next(err);
    }
})

//add a product
router.post('/', requireAdmin, async (req, res, next) => {
  try {
    res.send(await Product.create(req.body));
  } catch (error) {
    next(error);
  }
});

//delete single product
router.delete('/:id', requireAdmin, async (req, res, next) => {
    try {
      await Product.destroy({
        where: {
          id: req.params.id,
        },
      });
      res.send();
    } catch(err) {
      next(err)
    }
  });

  //edit single product
  router.put('/:id', requireAdmin, async (req, res, next) => {
    try {
      await Product.update( req.body, {where: {id: req.params.id}});

      res.send(await Product.findByPk(req.params.id));
    } catch (error) {
      next(error);
    }
  });

module.exports = router;