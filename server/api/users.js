const router = require("express").Router();
const {
  models: { User, Order },
} = require("../db");
const { requireAdmin, getToken } = require('./middleware');
module.exports = router;

router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and username fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ["id", "username"],
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

//UPDATE FOR THAT USER ONLY
router.get("/:id", getToken, async (req, res, next) => {
  try {
    if(!req.user) throw new Error('Not authorized');

    const orders = await req.user.getOrders();

    res.json({user: req.user.dataValues, orders});

  } catch (err) {
    next(err);
  }
});
