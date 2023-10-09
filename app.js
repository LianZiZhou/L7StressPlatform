require('dotenv').config();

const fastify = require('fastify')();

const { client } = require('./modules/redis');

fastify.get('*', (request, reply) => {
    reply.send('ok');
    client.incr('l7sp-req-get').catch(() => {});
});

fastify.post('*', (request, reply) => {
    reply.send('ok');
    client.incr('l7sp-req-post').catch(() => {});
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled promise rejection:', reason);
});

const PORT = process.env.PORT || (process.env.BASE_PORT || 13300) + (process.env.NODE_APP_INSTANCE ? parseInt(process.env.NODE_APP_INSTANCE) : 0);

fastify.listen({
    host: '0.0.0.0',
    port: PORT
}).then(() => {
    console.log('Server is running on port ' + PORT + '.');
});
