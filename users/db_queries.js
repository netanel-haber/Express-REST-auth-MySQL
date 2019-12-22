const mysql = require('mysql');
const { asyncForEach } = require("../utilities");
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

        let areKeysValid = keyValidation(enteredKeys, ["username", "password"]);
        if (!areKeysValid)
            return new DbActionConclusion({ keyValidation: false });

        let testResults = [];
        enteredKeys.forEach(field => {
            testResults.push((getTestForFieldName(field))(data[field]));
        });
        if (testResults.some(({ bottomLine }) => !bottomLine))
            return new DbActionConclusion({ inputValidationSummaries: testResults });

        let query = `SELECT * FROM info
        WHERE username=?;`;
        let results = (await queryTheDB(query, [data.username]));
        if (!results.length) return new DbActionConclusion({ summaryOfQueryIfNotSuccess: "USER_NOT_FOUND" });
        let { hash: userHash, salt: salt } = results[0];
        if (genHash(password + salt) !== userHash)
            return new DbActionConclusion({ summaryOfQueryIfNotSuccess: "PASSWORD_INCORRECT" });

        return new DbActionConclusion({ results: results[0] });
    },
    async getValuesForFieldInTable(field, table) {
        let query = `SELECT ?? FROM ${table}`;
        let results = await queryTheDB(query, [field]);
        console.log(results);
        return results.map(rowDataPacket => rowDataPacket[field]);
    }
});

//change data queries
Object.assign(module.exports, {
    async addUser(data) {
        let keys = Object.keys(data), values = Object.values(data);
        let inputKeys = await getUserInputFieldsForTable("info");
        inputKeys.push("password");

        //test keys
        let kCheck =keysCheck(keys, inputKeys.filter(value => { return (value != "hash") && (value != "salt"); }), true);
        if (kCheck !== null) return kCheck;

        //test values
        let vCheck = await valuesCheck(keys, values);
        if (vCheck !== null) return vCheck;

        //check if username exists already
        if (!await checkForPrimaryKeyInTable("username", data["username"], "info"))
            return new DbActionConclusion({ summaryOfQueryIfNotSuccess: "USER_ALREADY_EXISTS" });


        //gen hash
        let passIndex = keys.indexOf("password");
        let salt = genSalt();
        let hash = genHash(values[passIndex] + salt);
        keys.push("salt", "hash"); values.push(salt, hash);

        let orderedData = reorderData(keys, values, inputKeys);
        keys = Object.keys(orderedData), values = Object.values(orderedData);

        values[saltIndex] = salt, values[hashIndex] = hash;

        //gen query
        let dynamicKeyPlaceholders = "??,".repeat(keys.length).slice(0, -1);
        let dynamicValuePlaceholders = "?,".repeat(keys.length).slice(0, -1);
        let query = `INSERT INTO info (${dynamicKeyPlaceholders}) VALUES (${dynamicValuePlaceholders})`;

        let results = await queryTheDB(query, [...keys, ...values]);
        console.log(g);
        //await queryTheDB()
    }
});



function keysCheck(enteredKeys, properKeys, crossReference = false) {
    let areKeysValid = keyValidation(enteredKeys, properKeys, crossReference);
    if (!areKeysValid)
        return new DbActionConclusion({ keyValidation: false });
    return null;
}

async function valuesCheck(keys, values) {
    let testResults = [];
    await asyncForEach(keys, async (field, index) => {
        let test = getTestForFieldName(field);
        let result = await test(values[index]);
        testResults.push(result);
    });
    if (testResults.some(({ bottomLine }) => !bottomLine))
        return new DbActionConclusion({ inputValidationSummaries: testResults });
    return null;
}

function reorderData(jumbledKeys, jumbledValues, realKeyOrder) {
    let result = {};
    realKeyOrder.forEach(key => {
        result[key] = jumbledValues[jumbledKeys.indexOf[key]];
    });
    return result;
}




async function checkForPrimaryKeyInTable(key, value, table) {
    let query = `SELECT * FROM ${table} WHERE ??=?;`
    let results = await queryTheDB(query, [key, value]);
    return (results === null || results.length === 0);
}
async function getUserInputFieldsForTable(table) {
    let query = `SHOW FULL COLUMNS FROM ${table};`;
    let results = await queryTheDB(query);
    return results.filter(column => column.Comment !== "not_input").map(column => column["Field"]);
}

async function queryTheDB(parametrisedSqlQuery, parametersInOrder = []) {
    try {
        return await (new Promise((resolve, reject) => {
            conPool.getConnection((connectionPoolError, connection) => {
                if (connectionPoolError) {
                    throw connectionPoolError;
                }
                connection.query(parametrisedSqlQuery, parametersInOrder, (queryError, results) => {
                    connection.release();
                    if (queryError) throw queryError;
                    else resolve(results);
                });
            })
        }));
    } catch (ex) {
        throw ex;
    }
}









