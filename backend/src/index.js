const express = require('express');
const app = express();
require('dotenv').config();
const main = require("./config/db");
const User = require("./models/user");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/userAuth');
const redisClient = require('./config/redis');
const problemRouter = require("./routes/problemRouting");

// parser
app.use(express.json());
app.use(cookieParser());

// mount routes
app.use('/auth', authRouter);
app.use('/problem', problemRouter);

const initaliseConnection = async (req,res)=>{
    try{
// Promise.all([...]) takes an array of Promises and returns a single Promise that:
    // Resolves when all Promises inside it resolve
    // Resolves to an array of their resolved values

        await Promise.all([main(), redisClient.connect() ]);
        console.log("DB connected");

        app.listen(process.env.PORT, ()=>{
            console.log("Server Listening at Port: "+ process.env.PORT)
        });
    }
    catch(err){
        console.log("Error "+ err);
    }
}
initaliseConnection();

// main()
// .then(async ()=>{
//     app.listen(process.env.PORT, ()=>{
//         console.log("Server Listening at Port: "+ process.env.PORT)
//     })
//     main();
// })
// .catch(err=> console.log("Error  Occurred: "+err));