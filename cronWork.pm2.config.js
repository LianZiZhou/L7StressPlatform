module.exports = {
    apps: [
        {
            name: 'l7sp-load-worker-process',
            script: './cron.js',
            instances: 1,
            out_file: './logs/cron-out.log',
            error_file: './logs/cron-err.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss'
        }
    ]
};
