module.exports = {
    apps: [
        {
            name: 'l7sp-load-worker-process',
            script: './app.js',
            instances: 4,
            out_file: './logs/load-worker-out.log',
            error_file: './logs/load-worker-err.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss'
        }
    ]
};
