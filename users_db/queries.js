const { genHash, genSalt } = require('../utilities/hash_salt');
const { apiActionConclusion } = require('../db_action_conclusion');
const { reorderKeyValuePairs } = require("../utilities/utilities");
const { Messages } = require('../Messages');

const { Tables } = require('./tables');
const { validateKeysAndValues, validateKeyValuePair } = require('./input_validation');
const { queryTheDB } = require('./connection_pool');


Object.assign(module.exports, {
    INSERT: { addUser },
    SELECT: { getValuesForFieldInTable, authenticateUser, valKeyValuePair },
    UPDATE: { changePassword, updateUserInfo }
});


async function addUser(data) {
    let keys = Object.keys(data), values = Object.values(data);
    let inputKeys = await getUserInputFieldsForTable(Tables.users);
    inputKeys.splice(1, 0, "password");

    if (inputKeys.length !== keys.length)
        return new apiActionConclusion({ summaryOfQueryIfNotSuccess: Messages.insufInfo });

    let inputValidation = await validateKeysAndValues(keys, values, inputKeys);
    if (inputValidation.invalidKeys || inputValidation.invalidValues)
        return new apiActionConclusion(Object.assign({}, inputValidation));

    //check if username exists already
    if (!await checkForPrimaryKeyInTable("username", data["username"], Tables.users))
        return new apiActionConclusion({ summaryOfQueryIfNotSuccess: Messages.userExists });

    //gen hash
    let passIndex = keys.indexOf("password");
    let salt = genSalt();
    let hash = genHash(values[passIndex] + salt);

    keys.splice(passIndex, 1, "salt", "hash"); values.splice(passIndex, 1, salt, hash);

    inputKeys.splice(1, 1, "salt", "hash");

    //gen query
    let dynamicKeyPlaceholders = "??,".repeat(keys.length).slice(0, -1);
    let dynamicValuePlaceholders = "?,".repeat(keys.length).slice(0, -1);
    let query = `INSERT INTO ?? (${dynamicKeyPlaceholders}) VALUES (${dynamicValuePlaceholders})`;
    let orderedMap = reorderKeyValuePairs(keys, values, inputKeys);
    await queryTheDB(query, [Tables.users, ...orderedMap.keys(), ...orderedMap.values()]);

    return new apiActionConclusion({ bottomLine: true });
}

async function authenticateUser(data) {
    let keys = Object.keys(data), values = Object.values(data);
    let inputKeys = ["username", "password"];

    let inputValidation = await validateKeysAndValues(keys, values, inputKeys);
    if (inputValidation.invalidKeys || inputValidation.invalidValues)
        return new apiActionConclusion(Object.assign({}, inputValidation));

    let query = `SELECT * FROM ??
        WHERE username=?;`;
    let results = (await queryTheDB(query, [Tables.users, data.username]));
    if (!results.length) return new apiActionConclusion({ summaryOfQueryIfNotSuccess: Messages.userNotFound });
    let { hash: userHash, salt: salt } = results[0];
    if (genHash(data["password"] + salt) !== userHash)
        return new apiActionConclusion({ summaryOfQueryIfNotSuccess: Messages.passIncorrect });

    return new apiActionConclusion({ relevantResults: results });
}


async function changePassword(data) {
    let { username, updatedColumns } = data;
    let keys = Object.keys(updatedColumns), values = Object.values(updatedColumns);
    let inputKeys = ["password"];
    let inputValidation = await validateKeysAndValues(keys, values, inputKeys);
    if (inputValidation.invalidKeys || inputValidation.invalidValues)
        return new apiActionConclusion(Object.assign({}, inputValidation));

    let salt = genSalt();
    let hash = genHash(updatedColumns.password + salt);
    let query = `UPDATE ?? SET ?? = ?, ?? = ?
    WHERE ??=?`;
    await queryTheDB(query, [Tables.users, "salt", salt, "hash", hash, "username", username]);
    return new apiActionConclusion({ bottomLine: true });
}

async function updateUserInfo(data) {
    let { username, updatedColumns } = data;
    let keys = Object.keys(updatedColumns), values = Object.values(updatedColumns);
    let inputKeys = await getUserInputFieldsForTable(Tables.users);
    let inputValidation = await validateKeysAndValues(keys, values, inputKeys);
    if (inputValidation.invalidKeys || inputValidation.invalidValues)
        return new apiActionConclusion(Object.assign({}, inputValidation));


    let dynamicPlaceholders = "?? = ?,".repeat(keys.length).slice(0, -1);
    let query = `UPDATE ?? SET ${dynamicPlaceholders}
    WHERE ??=?`;
    let orderedData = Array.from(reorderKeyValuePairs(keys, values, inputKeys)).flat();
    await queryTheDB(query, [Tables.users, ...orderedData, "username", username]);
    return new apiActionConclusion({ bottomLine: true });
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














