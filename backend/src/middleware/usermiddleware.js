const User = require("../models/user");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const redisClient = require('../config/redis');


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
    // console.log("userMiddleware: payload", payload);

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

// to be checked ... why redis is disconnecting yaar 
    const isBlocked = await redisClient.exists(`token:${token}`); // ** no space: token:${token}
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