const validateUserData = require('../utils/validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const userAuthMiddleware = require("../middleware/Authmiddleware");
const redisClient = require('../config/redis');

const register = async(req,res)=>{
    try{// API Validation
        validateUserData(req.body);
        const {firstName, emailId, password} = req.body;
        // hash the password before stroing it in db 
        req.body.password =await bcrypt.hash(password, 10);

        const user = await User.create(req.body); // registered 
        // token generate 
        const token = jwt.sign({_id:user.id, emailId:emailId},process.env.JWT_KEY, {expiresIn: 60*60});
        res.cookie('token', token, {maxAge: 60*60*1000});
        res.status(201).send("user registered successfully");
    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}

const login = async(req,res)=>{
    try{

        const {emailId, password} = req.body;
        if(!emailId)
            throw new Error("Invalid Credentials");
        if(!password)
            throw new Error("Invalid Credentials");
        const user = await User.findOne({emailId}); //findOne returns a promise, so user is a Promise 
        const match = await bcrypt.compare(password, user.password ); // so put await too here 
        if(!match)
            throw new Error("Invalid Credentials");

        const token =  jwt.sign({_id:user._id , emailId:emailId},process.env.JWT_KEY,{expiresIn: 60*60});
        res.cookie('token',token,{maxAge: 60*60*1000}); // 1hr expiry time set, could also use new date method 
        res.status(200).send("Logged In Succeessfully");
    }
    catch(err){
        res.status(401).send("Error: "+err.message);
    }
}

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
    res.send("Logged Out Successfully");
}

module.exports = {register, login, getProfile, logout};