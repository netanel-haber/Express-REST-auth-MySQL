const mysql = require('mysql');
let conPool = mysql.createPool({
    connectionLimit: 10,
    // host: `db-users.chitjct3ipsw.us-east-2.rds.amazonaws.com`,
    host: 'nodetest.cfqshdcm1tco.eu-west-1.rds.amazonaws.com',
    user: 'admin',
    password: 'froopigloopi',
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
                let time = Date.now();
                console.log(`   --- querying the db: ${parametrisedSqlQuery}`);
                connection.query(formattedQuery, (queryError, results) => {
                    console.log(`   ${Date.now()-time}ms have passed---`);
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