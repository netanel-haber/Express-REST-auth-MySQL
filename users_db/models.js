const Sequelize = require('sequelize');
const { MYSQL_HOST, MYSQL_USERNAME, MYSQL_PASSWORD } = require('../enVar');
const sequelizeColorsConsole = '\x1b[36m%s\x1b[0m';

function logWithColor(string) {
    console.log(sequelizeColorsConsole, string)
}

const sequelize = new Sequelize('users', MYSQL_USERNAME, MYSQL_PASSWORD, {
    host: MYSQL_HOST,
    dialect: 'mysql',
    benchmark: true,
    logging: (...msg) => {
        if (msg[0].includes("1+1"))
            logWithColor('testing db connection with default query...');
        else {
            query = (msg[0].split(": ")[1]);
            time = msg[1] + "ms";
            logWithColor(`\n{query: ${query}\ntime: ${time}}\n`);
        }
    }
});



sequelize
    .authenticate()
    .then(() => {
        logWithColor('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

let genders = require('./sequelize/models/genders')(sequelize, Sequelize.DataTypes),
    users = require('./sequelize/models/info')(sequelize, Sequelize.DataTypes);



Object.assign(module.exports, {
    genders, users
});







