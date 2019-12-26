const mysql = require('mysql');
let conPool = mysql.createPool({
    connectionLimit: 10,
    host: 'db-users.chitjct3ipsw.us-east-2.rds.amazonaws.com',
    user: 'admin',
    password: 'AlarmingPe0ple',
    database: 'users'
});
module.exports.queryTheDB = async function (parametrisedSqlQuery, parametersInOrder = []) {
    try {
        return new Promise((resolve, reject) => {
            conPool.getConnection((connectionPoolError, connection) => {
                if (connectionPoolError) {
                    reject(connectionPoolError);
                    return;
                }
                let formattedQuery = mysql.format(parametrisedSqlQuery, parametersInOrder);
                connection.query(formattedQuery, (queryError, results) => {
                    connection.release();
                    (queryError) ?
                        reject(queryError) :
                        resolve(results);
                });
            })
        });
    } catch (ex) {
        throw ex;
    }
};