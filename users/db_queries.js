let mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'db-users.chitjct3ipsw.us-east-2.rds.amazonaws.com',
    user: 'admin',
    password: '23EDs2s28398UJH712w12w78h7',
    database: 'users'
});

//console.log(connection);


module.exports.checkUser = async(username, password) => {
    return new Promise(async(resolve, reject) => {
        let saltQuery = `SELECT salt FROM info
        WHERE user_name=${username};`;
        let salt = await queryGetter(saltQuery);

        connection.connect();
        connection.query(`SELECT salt from info`, function(error, results, fields) {
            connection.end();
            if (error)
                reject(error);
            resolve(results[0]);
        });
    });
}

//module.exports.getUserByPassword().then(result => { console.log(result) });




async function queryGetter(sqlQuery) {
    await connection.connect();
    try {
        return await connection.query(sqlQuery, function(error, results) {
            console.log(results);
            connection.end();
            if (error)
                throw error;
            return results[0];
        });
    } catch (ex) {
        return ex;
    }
}

console.log(queryGetter(`SELECT salt FROM info
    WHERE user_name='yochai';`));

// export async function addUser({ first_name, last_name, gender, age }) {
//     return new Promise((resolve, reject) => {
//         connection.connect();
//         connection.query(`INSERT INTO users (first_name, last_name, gender, age)\n                                VALUES ('${first_name}', '${last_name}', ${gender}, ${age});`, function(error, results, fields) {
//             connection.end();
//             if (error)
//                 reject(error);
//             console.log(results);
//             resolve({
//                 data: `the ${first_name} is add succesfully`,
//                 error: null
//             });
//         });
//     });
// }