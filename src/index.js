const express = require('express');
const app = express();
require('dotenv').config();
const main = require("./config/db");
const User = require("./models/user");
const cookieParser = require('cookie-parser')

app.use(express.json());
app.use(cookieParser());

main()
.then(async ()=>{
    app.listen(process.env.PORT, ()=>{
        console.log("Server Listening at Port: "+ process.env.PORT)
    })
    main();
})
.catch(err=> console.log("Error  Occurred: "+err));