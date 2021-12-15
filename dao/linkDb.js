const { Sequelize } = require('sequelize');
import config from '../config/index.js';
let dbUrl = config.dbUrl;

let sequelize = new Sequelize(dbUrl,{
    define: {
        freezeTableName: true
    }
});

async function testConnect() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

}
testConnect();

exports.sequelize = sequelize;
