module.exports = {
  apps : [{
    name: 'main-app-server',
    script: 'main.js',
    instances: 1 ,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
	log_date_format:"YYYY-MM-DD HH:mm:ss",
    env_development: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
