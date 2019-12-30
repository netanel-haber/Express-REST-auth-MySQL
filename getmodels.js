
let { MYSQL_HOST, MYSQL_USERNAME, MYSQL_PASSWORD } = require('./enVar');
let exec = require('child_process').exec, child;

child = exec(`sequelize-auto -h ${MYSQL_HOST} -d users -u ${MYSQL_USERNAME} -x ${MYSQL_PASSWORD} -p 3306  --dialect mysql -o C:\\Users\\viren\\Documents\\GitHub\\User_Account_Signin\\users_db\\sequelize\\models`,
    function (error, stdout, stderr) {
        console.log(stdout);
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });