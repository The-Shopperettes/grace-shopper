const router = require("express").Router();
const {
  models: { Visitor },
} = require("../db");

//gets or creates a visitor based on their IP address
router.get("/", async (req, res, next) => {
  try {
    //fixed
    let ip = req.headers["x-forwarded-for"]
      ? req.headers["x-forwarded-for"].split(",")[0]
      : "::1";

    let visitor = await Visitor.findOne({
      where: { token: ip },
    });

    if (!visitor) visitor = await Visitor.create({ token: ip });

    //send the visitor back
    res.send(visitor);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
