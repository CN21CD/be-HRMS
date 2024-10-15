const { createClient } = require('redis');

const client = createClient({
    password: 'u0WIDqmvrneqaQfQlFoTV2smE2vWOL1q',
    socket: {
        host: 'redis-12201.c17.us-east-1-4.ec2.redns.redis-cloud.com',
        port: 12201
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