const User = require("../models/user");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const redisClient = require('../config/redis');


// const userAuthMiddleware = async(req,res,next)=>{
//     const {token} = req.cookies;
//     // token check ---> 
//     if(!token)
//         throw new Error("Invalid token");
//     const payload = jwt.verify(token, process.env.JWT_KEY );
//     // console.log(payload);
//     const {_id} = payload;
//     if(!_id)
//         throw new Error ("invalid User");
//     // find document(profile)
//     const userProfile = await User.findById(_id);
//     if(!userProfile){
//         throw new Error ("invalid User");
//     }
//     // check if the token is present in redis blocked list
//     const isBlocked =  await redisClient.exists(`token: ${token}`);// returns true or false
//     if(isBlocked)
//         throw new Error("Invalid Token");

//     req.userProfile = userProfile; // can be used in getProfile 
//     next();
// }

const userAuthMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const payload = jwt.verify(token, process.env.JWT_KEY);
    if (!payload?._id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    const userProfile = await User.findById(payload._id);
    if (!userProfile) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // FIXED REDIS KEY — remove the space
    const isBlocked = await redisClient.exists(`token:${token}`);
    if (isBlocked) {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    req.userProfile = userProfile;
    next();

  } catch (err) {
    console.log("Auth error:", err.message);
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};



module.exports = userAuthMiddleware;