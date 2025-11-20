const validateUserData = require('../utils/validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const redisClient = require('../config/redis');

const register = async(req,res)=>{
    try{// API Validation
        validateUserData(req.body);
        const {firstName, emailId, password} = req.body;
        // hash the password before stroing it in db 
        req.body.password =await bcrypt.hash(password, 10);
        req.body.role = 'user'; // hardcoded to fix the role for user as user always, for admins create a different route 

        const user = await User.create(req.body); // registered 
        // token generate 
        const token = jwt.sign({_id:user.id, emailId:emailId, role: user.role},process.env.JWT_KEY, {expiresIn: 60*60});
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,      // only false for localhost
            sameSite: "None",    
            maxAge: 60 * 60 * 1000
        });
        // res.status(201).send("user registered successfully");

        const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id,
        }
        console.log(reply);
        res.status(201).json({
            success: true,
            message: "User registered Successfully",
            user: reply 
        });

    }
    catch(err){
        console.log("registerError: ", err.message);
        res.status(400).json({
            success:false,
            message:"Failed to register"
        });
    }
}

// const login = async(req,res)=>{
//     try{

//         const {emailId, password} = req.body;
//         if(!emailId)
//             throw new Error("Invalid Credentials");
//         if(!password)
//             throw new Error("Invalid Credentials");
//         const user = await User.findOne({emailId}); //findOne returns a promise, so user is a Promise 
//         const match = await bcrypt.compare(password, user.password ); // so put await too here 
//         if(!match)
//             throw new Error("Invalid Credentials");

//         const reply = {
//             firstName: user.firstName,
//             emailId: user.emailId,
//             _id: user._id,
//         }

//         const token =  jwt.sign({_id:user._id , emailId:emailId, role: user.role},process.env.JWT_KEY,{expiresIn: "1h"});
//         // res.cookie('token',token,{maxAge: 60*60*1000}); // 1hr expiry time set, could also use new date method 
//         res.cookie("token", token, {
//             httpOnly: true,
//             secure: false,
//             sameSite: "Lax",
//             maxAge: 60 * 60 * 1000,
//         });
//         // res.status(200).send("Logged In Succeessfully");
//         res.status(201).json({
//             success: true,
//             message: "Logged In Succeessfully",
//             user: reply 
//         });
//     }
//     catch(err){
//         res.status(400).json({
//             success:false,
//             message:"Failed to register"
//         });
//     }
// }

const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { _id: user._id, emailId: user.emailId, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,      // only false for localhost
      sameSite: "None",    
      maxAge: 60 * 60 * 1000
    });

    const reply = {
      firstName: user.firstName,
      emailId: user.emailId,
      _id: user._id,
    };

    return res.status(200).json({
      success: true,
      message: "Logged In Successfully",
      user: reply,
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(400).json({
      success: false,
      message: "Failed to login",
    });
  }
};


const getProfile = async (req,res)=>{
    // we not gonna ask user for (emailId or _id ) , current user's profile -> display 
    try{
        // userProfile added to req from -> middleware/userAuthMiddleware.js
        res.send(req.userProfile);
    }
    catch(err){
        res.send("Error "+err.message);
    }
}

const logout = async(req,res)=>{
    const {token} = req.cookies;
    // adding token to redis blockedList
    await redisClient.set(`token:${token}`, "Blocked");
    const payload = jwt.decode(token);
    // console.log(payload);
    await redisClient.expireAt(`token:${token}`, payload.exp);

    res.cookie("token", null, {expires: new Date(Date.now())});
    res.status(201).json({
        success: true,
        message: "Logged out Successfully"
    });
}

const adminRegister = async(req,res)=>{
    try{// API Validation
        validateUserData(req.body);
        const {firstName, emailId, password} = req.body;
        // hash the password before stroing it in db 
        req.body.password =await bcrypt.hash(password, 10);
        // req.body.role = 'admin'; // dont hardcore it , so that admin can register any new user as admin or user role

        const user = await User.create(req.body); // registered 
        // token generate 
        const token = jwt.sign({_id:user.id, emailId:emailId, role: user.role},process.env.JWT_KEY, {expiresIn: 60*60});
        res.cookie('token', token, {maxAge: 60*60*1000});
        res.status(201).send("user registered successfully");
    }
    catch(err){
        res.status(400).send("Error: "+err.message);
    }
}

module.exports = {register, login, getProfile, logout, adminRegister};
