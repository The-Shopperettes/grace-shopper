const router = require('express').Router();
const { models: { Visitor }} = require('../db');
module.exports = router


//gets or creates a visitor based on their IP address
router.get('/', async (req, res, next) => {
    try {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        const visitor = await Visitor.findOrCreate({
            where: {token: ip}
        })
        
        //send the visitor back
        res.send(visitor);

    } catch (err) {
        next(err);
    }
})