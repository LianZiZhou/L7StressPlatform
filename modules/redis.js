const redis = require("redis");
const client = redis.createClient({
    url: process.env.REDIS_URL
});

client.on('error', (err) => {
    console.log('Redis ' + err);
});

client.on('ready', () => {
    console.log('Redis Ready');
});

client.connect().then(() => {
    console.log('Redis Connected');
});

module.exports = {
    client
};
