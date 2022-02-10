const { Sequelize } = require('sequelize');
let config = require('../config/index.js');
let dbUrl = config.dbUrl;

let sequelize = new Sequelize(dbUrl,{
    define: {
        freezeTableName: true
    }
});

async function testConnect() {
    try {
        await sequelize.authenticate();
        console.log('Database Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

}
testConnect();

exports.sequelize = sequelize;

