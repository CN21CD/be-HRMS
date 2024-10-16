require('dotenv').config();
const { createClient } = require('redis');

const client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        connectTimeout: 3600000 // 1h extended timeout
    }
});

client.on('error', (err) => {
    console.error('Redis client error:', err);
});

client.on('end', () => {
    console.log('Redis client disconnected');
});

async function redisConnect() {
    if (!client.isOpen) {
        await client.connect();
        console.log('Redis client connected');
    }
}

module.exports = { client, redisConnect };