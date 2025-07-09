const express = require('express');
const authRouter = express.Router();
const {register, login, getProfile, logout} = require('../controllers/userAuthent');
const userAuthMiddleware = require("../middleware/Authmiddleware");

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout',userAuthMiddleware, logout); // userAuthMiddleware verify wether the token is even valid
authRouter.get('/getProfile', userAuthMiddleware, getProfile);

module.exports=authRouter;