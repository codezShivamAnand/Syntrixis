const validator = require('../utils/validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

const register = async(req,res)=>{
    try{// API Validation
        validator(req.body);
        const {firstName, emailId, password} = req.body;
        // hash the password before stroing it in db 
        req.body.password = bcrypt.hash(password, 10);

        const user = await User.create(req.body); // registered 
        // token generate 
        const token = jwt.sign({_id:user.id, emailId:emailId},process.env.JWT_KEY, {expiresIn: 60*60});
        res.cookie('token', token, {maxAge: 60*60*1000});
        res.status(201).send("user registered successfully");
    }
    catch(err){
        res.send(400).send("Error: "+err);
    }
}