let mysql = require('mysql');
let { genHash, genSalt } = require('./hash_and_salt');
let { queryConclusion } = require("./db_query_descriptions");


const conPool = mysql.createPool({
    connectionLimit: 10,
    host: 'db-users.chitjct3ipsw.us-east-2.rds.amazonaws.com',
    user: 'admin',
    password: '23EDs2s28398UJH712w12w78h7',
    database: 'users'
});


Object.assign(module.exports, {
    async authenticateUser(username, password) {
        let userQuery = `SELECT * FROM info
        WHERE user_name='${username}';`;

        let { results, error } = (await queryTheDB(userQuery));
        if (error)
            return queryConclusion(null, null, error);

        if (!results.length) return queryConclusion(null, "USER_NOT_FOUND", null);

        let { hash: userHash, salt: salt } = results[0];
        if (genHash(password + salt) !== userHash)
            return queryConclusion(null, "PASSWORD_INCORRECT", null);

        return queryConclusion(results[0], null, null);
    },
    async checkIfGenderExists(genderID) {
        let genderQuery = `SELECT * FROM static_gender
        WHERE id='${genderID}';`
        let results = await queryTheDB(genderQuery);
        if (results.length === 0)
            return false;
        return true;
    }
});


(async function testQueriesDev() {
    // console.log(await queryTheDB("asdfas"));
    console.log(await module.exports.authenticateUser("yochai", ".azdfasd"));

    // console.log(`0:${await module.exports.checkIfGenderExists(0)}`);
    // console.log(`1:${await module.exports.checkIfGenderExists(1)}`);
    // console.log(`2:${await module.exports.checkIfGenderExists(2)}`);

})();



async function queryTheDB(sqlQuery) {
    let queryDesc = {
        results: null,
        error: null
    };
    try {
        queryDesc.results = await (new Promise((resolve, reject) => {
            conPool.getConnection((connectionPoolError, connection) => {
                if (connectionPoolError)
                    reject(connectionPoolError);
                connection.query(sqlQuery, (queryError, results) => {
                    connection.release();
                    (queryError) ? reject(queryError): resolve(results);
                });
            })
        }));
    } catch (ex) {
        queryDesc.error = ex;
    }
    return queryDesc;
}














/*
    async function addUser(username, password,) {
        let salt = genSalt();


            let userQuery = `SELECT * FROM info
        WHERE user_name=${username};`;


    }
    
async function queryTheDB(sqlQuery) {
    let queryDesc = {
        connectionError: null,
        queryError: null,
        results
    };
    await (conPool.getConnection(async(connectionPoolError, connection) => {
        if (connectionPoolError) queryDesc.connectionError = connectionPoolError;
        await connection.query(sqlQuery, (queryError, results) => {
            connection.release(async() => {
                (queryError) ? (queryDesc.queryError = queryError) : (queryDesc.results = results);
            });
        })
    }));
    return queryDesc;
}    
    
    */





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