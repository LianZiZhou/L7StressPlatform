const { supabase } = require('./modules/supabase');

const channelA = supabase
    .channel('schema-db-changes')
    .on(
        'postgres_changes',
        {
            event: 'INSERT',
            schema: 'public',
            table: 'stats'
        },
        (payload) => console.log(payload)
    )
    .subscribe()
