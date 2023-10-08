require('dotenv').config();

const fetch = require('node-fetch');

const { client } = require('./modules/redis');

setInterval(async () => {
    const getCount = parseInt(await client.get('l7sp-req-get'));
    const postCount = parseInt(await client.get('l7sp-req-post'));
    await client.set('l7sp-req-get', 0);
    await client.set('l7sp-req-post', 0);
    console.log('GET: ' + getCount + ' POST: ' + postCount);
    await fetch(process.env.STAT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + process.env.STAT_TOKEN
        },
        body: JSON.stringify({
            get: getCount,
            post: postCount,
            time: Date.now()
        })
    }).catch(() => {});
}, 1000);
