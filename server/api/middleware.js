const { User, Visitor } = require("../db").models;

const requireAdmin = async(req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (token) {
      const user = await User.findByToken(token);
      
      if(!user.isAdmin) {
        throw new Error('Not authorized');
      }

    } else {
      throw new Error('Not authorized');
    }

    next();
  } catch (err) {
    next(err);
  }
}

//auth middleware
const getToken = async (req, res, next) => {
    try {
      
      const token = req.headers.authorization;

      if (token) {
        const user = await User.findByToken(token);
        req.user = user;
  
      } else {
        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  
        let visitor = await Visitor.findOne({
          where: { token: ip },
        });
  
        if (!visitor) visitor = await Visitor.create({ token: ip });
  
        req.visitor = visitor;
      }
  
      next();
    } catch (err) {
      next(err);
    }
  };

module.exports = {
    requireAdmin,
    getToken
}