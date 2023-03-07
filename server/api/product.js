const router = require("express").Router();
const { Product } = require("../db").models;
const { Sequelize } = require("sequelize");
const { requireAdmin } = require("./middleware");

// get all products
router.get("/", async (req, res, next) => {
  try {
    const { cycleFilter, waterFilter, sort, search } = req.query;
    // set page to the query, or default to 1
    const page = req.query.page || 1;
    // set the perPage limit to the query, or default to 9
    const perPage = req.query.perPage || 9;

    // calculate the offset
    const offset = (page - 1) * perPage;

    // filter all Products by any search queries utilized
    let where = {};
    if (cycleFilter) {
      where.cycle = cycleFilter;
    }
    if (waterFilter) {
      where.watering = waterFilter;
    }
    if (search) {
      where.name = { [Sequelize.Op.iLike]: `%${search}%` };
    }

    // if no sort parameter passed, default sort descending
    let pageSort = sort || "DESC";
    
    // get all the products
    res.json({
      products: await Product.findAll({
        offset,
        limit: perPage,
        where,
        order: [["price", pageSort]],
      }),
      productCount: await Product.count({ where }),
    });
  } catch (err) {
    next(err);
  }
});

// get product count via Product.count
// router.get('/count', async (req, res, next) => {
//     try{
//         const {cycleFilter, waterFilter, search} = req.query;
//         let where = {};
//         if(cycleFilter){
//             where.cycle = cycleFilter;
//         }
//         if(waterFilter){
//             where.watering = waterFilter;
//         }
//         if(search) {
//             where.name = {[Op.iLike]:`%${search}%`};
//         }

//         res.json(await Product.count({where}));
//     } catch (err) {
//         next(err);
//     }
// })

// get single product
router.get("/:id", async (req, res, next) => {
  try {
    res.send(await Product.findByPk(req.params.id));
  } catch (err) {
    next(err);
  }
});

//delete single product
router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.send();
  } catch (err) {
    next(err);
  }
});

//edit single product
router.put("/:id", requireAdmin, async (req, res, next) => {
  try {
    const editProduct = await Product.findByPk(req.params.id);
    res.send(
      await editProduct.update({
        name: req.body.name,
        cycle: req.body.cycle,
        watering: req.body.watering,
        sunlight: req.body.sunlight,
        qty: req.body.qty,
        price: req.body.price,
      })
    );
  } catch (error) {
    next(error);
  }
});

module.exports = router;
