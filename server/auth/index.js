const router = require('express').Router();
const {
  models: { User },
} = require('../db');
module.exports = router;

router.post('/login', async (req, res, next) => {
  try {
    res.send({ token: await User.authenticate(req.body) });
  } catch (err) {
    next(err);
  }
});

router.post('/signup', async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.send({ token: await user.generateToken() });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('User already exists');
    } else {
      next(err);
    }
  }
});

router.get('/me', async (req, res, next) => {
  console.log('got to route');
  try {
    res.send(await User.findByToken(req.headers.authorization));
  } catch (ex) {
    next(ex);
  }
});

// router.get('/visitors', async (req, res, next) => {
//   console.log(" at visitor");
//   try {
//       const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

//       let visitor = await Visitor.findOne({
//           where: {token: ip}
//       });

//       if(!visitor) visitor = await Visitor.create({token: ip});
      
//       //send the visitor back
//       res.send(visitor);

//   } catch (err) {
//       next(err);
//   }
// });
