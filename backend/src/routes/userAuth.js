const express = require('express');
const authRouter = express.Router();
const {register, login, getProfile, logout, adminRegister} = require('../controllers/userAuthent');
const userAuthMiddleware = require("../middleware/usermiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout',userAuthMiddleware, logout); // userAuthMiddleware verify wether the token is even valid
authRouter.get('/getProfile', userAuthMiddleware, getProfile);

authRouter.post('/admin/register', adminMiddleware, adminRegister);

module.exports=authRouter;