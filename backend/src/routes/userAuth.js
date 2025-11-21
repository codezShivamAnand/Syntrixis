const express = require('express');
const authRouter = express.Router();
const {register, login, getProfile, logout, adminRegister} = require('../controllers/userAuthent');
const userAuthMiddleware = require("../middleware/usermiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

authRouter.post('/register', register); // /user/register
authRouter.post('/login', login);
authRouter.post('/logout',userAuthMiddleware, logout); // userAuthMiddleware verify wether the token is even valid
authRouter.get('/getProfile', userAuthMiddleware, getProfile);
authRouter.get('/check', userAuthMiddleware, (req,res)=>{
    try{
        // console.log("userProfile", req.userProfile);
        const reply = {
            firstName: req.userProfile.firstName,
            emailId: req.userProfile.emailId,
            _id:req.userProfile._id,
            role:req.userProfile.role
        }
        res.status(200).json({
            user:reply,
            message:"Valid User",
            success:true
        });
    }catch(error){
        console.error("checkAuth error:", error);
        res.status(401).json({
            message:"Invalid or expired token",
            success:false
        })
    }
});
authRouter.post('/admin/register', adminMiddleware, adminRegister);

module.exports=authRouter;