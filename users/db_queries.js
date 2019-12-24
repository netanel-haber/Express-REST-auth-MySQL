const mysql = require('mysql');
const { genHash, genSalt } = require('./hash_and_salt');
const { DbActionConclusion } = require('./db_action_conclusion');
const { keyValidation, valueValidation } = require('../input_validation');


const conPool = mysql.createPool({
    connectionLimit: 10,
    host: 'db-users.chitjct3ipsw.us-east-2.rds.amazonaws.com',
    user: 'admin',
    password: 'AlarmingPe0ple',
    database: 'users'
});

module.exports.INSERT = { addUser };
module.exports.SELECT = { getValuesForFieldInTable, authenticateUser };




async function addUser(data) {
    let keys = Object.keys(data), values = Object.values(data);
    let inputKeys = await getUserInputFieldsForTable("info");
    inputKeys.splice(1, 0, "password");

    let inputValidation = await validateKeysAndValues(keys, values, inputKeys);
    if (inputValidation.invalidKeys || inputValidation.invalidValues)
        return new DbActionConclusion(Object.assign({}, inputValidation));

    //check if username exists already
    if (!await checkForPrimaryKeyInTable("username", data["username"], "info"))
        return new DbActionConclusion({ summaryOfQueryIfNotSuccess: "USER_ALREADY_EXISTS" });

    //gen hash
    let passIndex = keys.indexOf("password");
    let salt = genSalt();
    let hash = genHash(values[passIndex] + salt);

    keys.splice(passIndex, 1, "salt", "hash"); values.splice(passIndex, 1, salt, hash);

    inputKeys.splice(1, 1, "salt", "hash");

    //gen query
    let dynamicKeyPlaceholders = "??,".repeat(keys.length).slice(0, -1);
    let dynamicValuePlaceholders = "?,".repeat(keys.length).slice(0, -1);
    let query = `INSERT INTO info (${dynamicKeyPlaceholders}) VALUES (${dynamicValuePlaceholders})`;

    let orderedMap = reorderData(keys, values, inputKeys);

    await queryTheDB(query, [...orderedMap.keys(), ...orderedMap.values()]);
    return new DbActionConclusion({ bottomLine: true });
}



async function authenticateUser(data) {
    let keys = Object.keys(data), values = Object.values(data);
    let inputKeys = ["username", "password"];

    let inputValidation = await validateKeysAndValues(keys, values, inputKeys);
    if (inputValidation.invalidKeys || inputValidation.invalidValues)
        return new DbActionConclusion({summaryOfQueryIfNotSuccess: "USER_NOT_FOUND"});

    let query = `SELECT * FROM info
        WHERE username=?;`;
    let results = (await queryTheDB(query, [data.username]));
    if (!results.length) return new DbActionConclusion({ summaryOfQueryIfNotSuccess: "USER_NOT_FOUND" });
    let { hash: userHash, salt: salt } = results[0];
    if (genHash(data["password"] + salt) !== userHash)
        return new DbActionConclusion({ summaryOfQueryIfNotSuccess: "PASSWORD_INCORRECT" });

    return new DbActionConclusion({ bottomLine:true, relevantResults: results });
}
async function checkForPrimaryKeyInTable(key, value, table) {
    let query = `SELECT * FROM ${table} WHERE ??=?;`
    let results = await queryTheDB(query, [key, value]);
    return (results === null || results.length === 0);
}
async function getUserInputFieldsForTable(table) {
    let query = `SHOW FULL COLUMNS FROM ${table};`;
    let results = await queryTheDB(query);
    return results.filter(column => column.Comment === "input").map(column => column["Field"]);
}
async function getValuesForFieldInTable(field, table) {
    let query = `SELECT ?? FROM ${table}`;
    let results = await queryTheDB(query, [field]);
    return results.map(rowDataPacket => rowDataPacket[field]);
}



async function validateKeysAndValues(enteredKeys, enteredValues, actualKeys) {
    let accumulatedDbInfo = {};
    accumulatedDbInfo.invalidKeys = keyValidation(enteredKeys, actualKeys);
    accumulatedDbInfo.invalidValues = await valueValidation(enteredKeys, enteredValues);
    return accumulatedDbInfo;
}


function reorderData(jumbledKeys, jumbledValues, realKeyOrder) {
    return new Map(realKeyOrder.map(key => [key, jumbledValues[jumbledKeys.indexOf(key)]]));
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









