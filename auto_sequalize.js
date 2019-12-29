let SequelizeAuto = require('sequelize-auto');
const { MYSQL_PASSWORD, MYSQL_HOST, MYSQL_USERNAME } = require('./enVar');

let auto = new SequelizeAuto('users', MYSQL_USERNAME, MYSQL_PASSWORD, {
    host: MYSQL_HOST,
    dialect: 'mysql',
    directory: 'C:\\Users\\viren\\Documents\\GitHub\\User_Account_Signin\\users_db\\sequelize\\models', // prevents the program from writing to disk
    port: '3306',
})
 
auto.run(function (err) {
  if (err) throw err;
 
  console.log(auto.tables); // table list
  console.log(auto.foreignKeys); // foreign key list
});
 
