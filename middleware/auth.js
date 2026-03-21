const Users = require('../models/userModel');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const logger = require('../utils/logger');

const auth = async (req,res,next) => {
    try {
        const token = req.header("Authorization");

        if(!token){
            return res.status(400).json({ msg: "You are not authorized" });
        }

        const decoded = jwt.verify(token, config.access_token_secret);

        if (!decoded) {
          return res.status(400).json({ msg: "You are not authorized" });
        }

        const user = await Users.findOne({_id: decoded.id}).select("-password");

        if (!user) {
            return res.status(400).json({ msg: "User does not exist." });
        }

        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
}



module.exports = auth;