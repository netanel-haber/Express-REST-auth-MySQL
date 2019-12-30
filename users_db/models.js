const Sequelize = require('sequelize');
const { MYSQL_HOST, MYSQL_USERNAME, MYSQL_PASSWORD } = require('../enVar');


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

let genders = require('./sequelize/models/genders')(sequelize, Sequelize.DataTypes),
    users = require('./sequelize/models/info')(sequelize, Sequelize.DataTypes);


Object.assign(module.exports, {
    genders, users
});

var exec = require('child_process').exec, child;






