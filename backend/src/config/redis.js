const { createClient } = require('redis');
require('dotenv').config();


const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-11943.c264.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 11943
    }
});
module.exports = redisClient;

                                        

