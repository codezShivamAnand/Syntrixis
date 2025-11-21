const { createClient } = require('redis');
require('dotenv').config();
                       
const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-11464.crce217.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 11464
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));
module.exports = redisClient;


// const redisClient = createClient({
//     username: 'default',
//     password: process.env.REDIS_PASS,
//     socket: {
//         host: 'redis-11943.c264.ap-south-1-1.ec2.redns.redis-cloud.com',
//         port: 11943
//     }
// });
