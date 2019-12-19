let mysql = require('mysql');
let { genHash, genSalt } = require('./hash_and_salt');
let { queryConclusion } = require('./db_query_descriptions');
let { wrapArrInChar } = require('../utilities');
let { validName, validPassword, validGender, validAge, validUsername } = require('../input_validation');


const conPool = mysql.createPool({
    connectionLimit: 10,
    host: 'db-users.chitjct3ipsw.us-east-2.rds.amazonaws.com',
    user: 'admin',
    password: 'AlarmingPe0ple',
    database: 'users'
});

//data queries
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
    async checkForPrimaryKeyInTable(key, value, table) {
        let query = `SELECT * FROM ${table}
        WHERE ${key}='${value}';`
        let { results } = await queryTheDB(query);
        if (results === null || results.length === 0)
            return false;
        return true;
    },
    async getAllRelevantUserFields() {
        let fieldsQuery = `SHOW FULL COLUMNS FROM users.info;`;
        let { results: columnsData, error } = await queryTheDB(fieldsQuery);
        let relevantFields = columnsData.filter(column => column.Comment != "");
        return results;
    },
    async validateInput(data) {

    }
    // userFields
    // genderValues
});


//change data queries
Object.assign(module.exports, {
    async addUser(data) {
        let fields = Object.keys(data);
        let values = Object.values(data);

        let passIndex = fields.indexOf("password");

        let salt = genSalt();
        let hash = genHash(values[passIndex] + salt);

        fields.splice(passIndex, 1, "salt", "hash");
        values.splice(passIndex, 1, salt, hash);

        let addUserQuery = `INSERT INTO info (${fields}) 
                            VALUES (${wrapArrInChar(values)})`;

        console.log(addUserQuery);
        //await queryTheDB()
    }
});



(async function testQueriesDev() {
    // // console.log(await queryTheDB("asdfas"));
    // console.log(await module.exports.authenticateUser("yochai", ".azdfasd"));

    // // console.log(`0:${await module.exports.checkIfGenderExists(0)}`);
    // // console.log(`1:${await module.exports.checkIfGenderExists(1)}`);
    // // console.log(`2:${await module.exports.checkIfGenderExists(2)}`);
    // let arr =[];
    // console.log(JSON.stringify({x:"y", y:"x"},(_,key,value)=>{
    //     arr.push({key,value});
    // }));
    //module.exports.addUser({ x: 1, y: 2, password: "donaldDuck" });
    module.exports.getAllRelevantUserFields();
})();





async function queryTheDB(sqlQuery) {
    let queryDesc = {
        results: null,
        error: null
    };
    try {
        queryDesc.results = await (new Promise((resolve, reject) => {
            conPool.getConnection((connectionPoolError, connection) => {
                if (connectionPoolError) {
                    reject(connectionPoolError);
                    return;
                }
                connection.query(sqlQuery, (queryError, results) => {
                    connection.release();
                    (queryError) ? reject(queryError) : resolve(results);
                });
            })
        }));
    } catch (ex) {
        queryDesc.error = ex;
    }
    return queryDesc;
}










