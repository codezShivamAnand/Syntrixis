const mongoose = require('mongoose');
require('dotenv').config();

async function main(){
    mongoose.connect(process.env.db_Connect_string);
    // console.log(process.env.db_Connect_string);
}

module.exports = main;