require('dotenv').config();

const express = require('express');
const ws = require('ws');

const app = express();
const websocket = new ws.Server({ noServer: true });

app.use(express.json({ limit: '50mb'}));

app.post('/api/backend/push', (req, res) => {
    if(req.headers['authorization'] !== process.env.STAT_TOKEN) {
        res.send({
            status: 401,
            message: 'Unauthorized'
        });
        return;
    }
    const { get, post, time } = req.body;
    sendMessage({
        ...req.body
    }, 'watch:all');
    sendMessage({
        get,
        time
    }, 'watch:get');
    sendMessage({
        post,
        time
    }, 'watch:post');
    res.send({
        status: 200,
        message: 'OK'
    });
});

const channels = {};

const sendMessage = (message, channel) => {
    if(!channels[channel]) return;
    for(const socket of channels[channel]) {
        socket.send(JSON.stringify({
            channel,
            data: message
        }));
    }
};

websocket.on('connection', (socket, req) => {
    const channel = req.query.channel;
    if(!channel) {
        socket.close();
        return;
    }
    if(['watch:all', 'watch:get', 'watch:post'].indexOf(channel) === -1) {
        socket.close();
        return;
    }
    if(!channels[channel]) channels[channel] = [];
    channels[channel].push(socket);
    socket.on('message', (message) => {
        const data = JSON.parse(message);
        if(data.event === 'ping') {
            socket.send(JSON.stringify({
                status: 200,
                channel,
                event: 'pong'
            }));
        }
    });
    socket.on('close', () => {
        channels[channel].splice(channels[channel].indexOf(socket), 1);
    });
});

app.listen(process.env.SOCKET_PORT || 13299, () => {
    console.log('Server started at ' + (process.env.PORT || 13299));
}).on('upgrade', (request, socket, head) => {
    request.path = request.url.split('?')[0];
    request.form = request.url.split('?')[1];
    if(!request.form) request.form = '';
    const formSplit = request.form.split('&');
    request.query = {};
    for(let i = 0; i < formSplit.length; i++) {
        const formSplit2 = formSplit[i].split('=');
        request.query[decodeURIComponent(formSplit2[0])] = decodeURIComponent(formSplit2[1]);
    }
    function sendError(code, message) {
        socket.write(`HTTP/1.1 ${code} ${message}\r\n\r\n`);
        socket.destroy();
    }
    if(!request.query.channel) sendError(400, 'Bad Request');
    else if (request.path !== '/api/socket') sendError(404, 'Not Found');
    else {
        websocket.handleUpgrade(request, socket, head, (socket) => {
            websocket.emit('connection', socket, request);
        });
    }
});
