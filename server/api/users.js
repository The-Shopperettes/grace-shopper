const router = require("express").Router();
const {
  models: { User, Order, CartItem },
} = require("../db");
const { requireAdmin, getToken } = require('./middleware');
module.exports = router;

//admin only route to get all users, paginated
router.get("/", requireAdmin, async (req, res, next) => {
  try {
    // set page to the query, or default to 1
    const page = req.query.page || 1;
    // set the perPage limit to the query, or default to 15
    const perPage = req.query.perPage || 20;

    // calculate the offset
    const offset = (page - 1) * perPage;

    const users = await User.findAll({
      attributes: ["id", "username", "isAdmin", "email"],
      offset,
      limit: perPage,
      include: Order,
      order: ["id"]
    });

    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.get("/count", requireAdmin, async (req, res, next) => {
  try {
    res.json(await User.count());
  } catch (err) {
    next(err);
  }
})

router.get("/:id", getToken, async (req, res, next) => {
  try {
    if(!req.user) throw new Error('Not authorized');

    const orders = await req.user.getOrders();

    res.json({user: req.user.dataValues, orders});

  } catch (err) {
    next(err);
  }
});

router.delete("/:id", getToken, async(req, res, next) => {
  try {
    if(!req.user) throw new Error('Not authorized');

    if(req.user.isAdmin) {
      User.destroy({where: {id: req.params.id}});
    } else {
      req.user.destroy();
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
})
