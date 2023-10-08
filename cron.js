require('dotenv').config();

const { supabase } = require('./modules/supabase');

const { client } = require('./modules/redis');

setInterval(async () => {
    const getCount = parseInt(await client.get('l7sp-req-get'));
    const postCount = parseInt(await client.get('l7sp-req-post'));
    await client.set('l7sp-req-get', 0);
    await client.set('l7sp-req-post', 0);
    await supabase.from('stats').insert({
        get: getCount,
        post: postCount
    });
}, 1000);
