const redis = require('redis')
require('dotenv').config()


const client = redis.createClient({
    url:process.env.REDIS_URL,
    socket: {
        connectTimeout: 50000 // Increase the connection timeout to 50 seconds (50000 milliseconds)
    }
})


client.on('error',(err)=>{
    console.error('Redis error' , err)
})

client.on('connect',()=>{
    console.log('Redis is connected')
})

client.connect();

module.exports = client