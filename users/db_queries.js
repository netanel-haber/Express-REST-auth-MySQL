const mysql = require('mysql');
const { genHash, genSalt } = require('./hash_and_salt');
const { DbActionConclusion } = require('./db_action_conclusion');
const { getTestForFieldName, keyValidation } = require('../input_validation');



const conPool = mysql.createPool({
    connectionLimit: 10,
    host: 'db-users.chitjct3ipsw.us-east-2.rds.amazonaws.com',
    user: 'admin',
    password: 'AlarmingPe0ple',
    database: 'users'
});

//data queries
Object.assign(module.exports, {
    async authenticateUser(data) {
        let enteredKeys = Object.keys(data);
        let enteredValues = Object.values(data);

        let areKeysValid = keyValidation(enteredKeys, ["username", "password"]);
        if (!areKeysValid)
            return new DbActionConclusion({ keyValidation: false });

        let testResults = [];
        enteredKeys.forEach(field => {
            testResults.push((getTestForFieldName(field))(data[field]));
        });
        if (testResults.some(({ bottomLine }) => !bottomLine))
            return new DbActionConclusion({ inputValidationSummaries: testResults });

        let query = `SELECT * FROM users.info
        WHERE 'username'=?;`;
        let { results, error } = (await queryTheDB(query, [username]));
        if (error)
            return new DbActionConclusion({ failedError: error });
        if (!results.length) return DbActionConclusion({ summaryOfQueryIfNotSuccess: "USER_NOT_FOUND" });
        let { hash: userHash, salt: salt } = results[0];
        if (genHash(password + salt) !== userHash)
            return new DbActionConclusion({ summaryOfQueryIfNotSuccess: "PASSWORD_INCORRECT" });

        return new DbActionConclusion({ results: results[0] });
    },

    async checkForPrimaryKeyInTable(key, value, table) {
        let query = `SELECT * FROM ${table} WHERE ?=?;`
        let { results, error } = await queryTheDB(query, [key, value]);
        if (error)
            return DbActionConclusion(null, null, error);
        return (results === null || results.length === 0);
    },

    async getValuesForFieldInTable(field, table) {
        let query = `SELECT ?? FROM ${table}`;
        let { results, error } = await queryTheDB(query, [field]);
        if (error)
            return DbActionConclusion(null, null, error);
        return results.map(rowDataPacket => rowDataPacket[field]);
    },

    async getUserInputFieldsForTable(table) {
        let query = `SHOW FULL COLUMNS FROM ${table};`;
        let { results, error } = await queryTheDB(query);
        if (error)
            return DbActionConclusion(null, null, error);
        return results.filter(column => column.Comment === "input").map(column => column["Field"]);
    },

});


//change data queries
Object.assign(module.exports, {
    async addUser(data) {
        let enteredKeys = Object.keys(data);
        let enteredValues = Object.values(data);

        //test keys
        let inputFields = await getUserInputFieldsForTable("info");
        let areKeysValid = keyValidation(enteredKeys, inputFields.push("password"));
        if (!areKeysValid)
            return DbActionConclusion({ keyValidation: false });

        //test values
        let testResults = [];
        enteredKeys.forEach(field, index => {
            testResults.push(getTestForFieldName(field)(enteredValues[index]));
        });

        //gen hash
        let passIndex = enteredKeys.indexOf("password");
        let salt = genSalt();
        let hash = genHash(enteredValues[passIndex] + salt);
        enteredKeys.splice(passIndex, 1, "salt", "hash");
        enteredValues.splice(passIndex, 1, salt, hash);

        //gen query
        let dynamicParameterPlaceholders = "?,".repeat(enteredKeys.length).slice(0, -1);
        let query = `INSERT INTO info (${dynamicParameterPlaceholders}) 
                            VALUES (${dynamicParameterPlaceholders})`;

        console.log(query);
        //await queryTheDB()
    }
});



(async function testQueriesDev() {
    // // console.log(await queryTheDB("asdfas"));
    //console.log(await module.exports.authenticateUser({ username: "yochai", password: ".azdfasd" }));

    // // console.log(`0:${await module.exports.checkIfGenderExists(0)}`);
    // // console.log(`1:${await module.exports.checkIfGenderExists(1)}`);
    // // console.log(`2:${await module.exports.checkIfGenderExists(2)}`);
    // let arr =[];
    // console.log(JSON.stringify({x:"y", y:"x"},(_,key,value)=>{
    //     arr.push({key,value});
    // }));
    //module.exports.addUser({ x: 1, y: 2, password: "donaldDuck" });
    //module.exports.getAllRelevantUserFields();
    console.log(module.exports.getValuesForFieldInTable("gender_id", "static_gender"));
})();




async function queryTheDB(parametrisedSqlQuery, parametersInOrder = []) {
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
                connection.query(parametrisedSqlQuery, parametersInOrder, (queryError, results) => {
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


class DbException { }







