const User = require("../models/user");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const redisClient = require('../config/redis');


const adminMiddleware = async(req,res,next)=>{
    const {token} = req.cookies;
    // token check ---> 
    if(!token)
        throw new Error("Invalid token");
    const payload = jwt.verify(token, process.env.JWT_KEY );
    // console.log(payload);
    const {_id} = payload;
    if(!_id)
        throw new Error ("invalid User");
    // find document(profile)
    const userProfile = await User.findById(_id);
    if(!userProfile){
        throw new Error ("invalid User");
    }
    // check if the token is present in redis blocked list
    const isBlocked =  await redisClient.exists(`token: ${token}`);// returns true or false
    if(isBlocked)
        throw new Error("Invalid Token");

    // check for admin 
    if(payload.role != 'admin')
        throw new Error("Invalid admin");

    req.userProfile = userProfile; // can be used in getProfile 
    next();
}

module.exports = adminMiddleware;