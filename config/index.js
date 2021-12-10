const configLite = require('config-lite');
const config = configLite(__dirname);
console.log("process.env.NODE_ENV is", process.env.NODE_ENV);
module.exports = config;
