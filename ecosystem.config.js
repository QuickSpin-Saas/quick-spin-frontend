module.exports = {
  apps: [{
    name: 'quickspin-frontend',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    instances: 'max', // Use all CPU cores
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.yourdomain.com/api/v1',
    },

    // Resource limits
    max_memory_restart: '500M',

    // Logging
    error_file: '/home/deploy/logs/frontend/error.log',
    out_file: '/home/deploy/logs/frontend/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,

    // Auto-restart on crash
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    restart_delay: 4000,

    // Graceful shutdown
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 10000,

    // Monitoring
    watch: false,
    ignore_watch: ['node_modules', 'logs', '.next/cache'],

    // Environment-specific settings
    env_production: {
      NODE_ENV: 'production',
    },
    env_development: {
      NODE_ENV: 'development',
    }
  }]
};
