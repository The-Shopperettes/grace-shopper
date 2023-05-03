const router = require("express").Router();
const {
  models: { User },
} = require("../db");
module.exports = router;

router.post("/login", async (req, res, next) => {
  try {
    res.send({ token: await User.authenticate(req.body) });
  } catch (err) {
    next(err);
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.send({ token: await user.generateToken() });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      res.status(401).send("User already exists");
    } else {
      next(err);
    }
  }
});

//get logged in user data
router.get("/me", async (req, res, next) => {
  try {
    const { dataValues } = await User.findByToken(req.headers.authorization);
    //don't send the password
    const { password, ...user } = dataValues;
    res.send(user);
  } catch (ex) {
    next(ex);
  }
});
