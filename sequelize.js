const Sequelize = require('sequelize');
const { MYSQL_HOST, MYSQL_USERNAME, MYSQL_PASSWORD } = require('./enVar');

// Option 1: Passing parameters separately
const sequelize = new Sequelize('users', MYSQL_USERNAME, MYSQL_PASSWORD, {
    host: MYSQL_HOST,
    dialect: 'mysql'
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });