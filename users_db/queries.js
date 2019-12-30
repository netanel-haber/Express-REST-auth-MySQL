const { users } = require('./models');
const { validateKeysAndValues, validKeys } = require('./input_validation');

const { genHash, genSalt } = require('../utilities/hash_salt');
const { apiActionConclusion } = require('../db_action_conclusion');
const { Messages } = require('../Messages');

Object.assign(module.exports, {
    INSERT: { addUser },
    SELECT: { authenticateUser },
    UPDATE: { changePassword, updateUserInfo }
});

async function addUser(data) {
    let valResult = validateKeysAndValuesWrapper(data, validKeys.addUser);
    if (valResult)
        return valResult;

    if (await sequelizeWrapper(users.findOne.bind(users), { where: { username: data.username } }))
        return new apiActionConclusion({ summaryOfQueryIfNotSuccess: Messages.userExists });

    let salt = genSalt();
    let hash = genHash(data.password + salt);
    delete data.password;

    Object.assign(data, { salt, hash });

    if (await sequelizeWrapper(users.create, data))
        return new apiActionConclusion({ bottomLine: true });
}


async function authenticateUser(data) {
    let valResult = validateKeysAndValuesWrapper(data, validKeys.authenticateUser);
    if (valResult)
        return valResult;

    let result = await sequelizeWrapper(users.findOne.bind(users), { where: { username: data.username } });
    if (!result)
        return new apiActionConclusion({ summaryOfQueryIfNotSuccess: Messages.userNotFound });

    let { hash, salt } = result;

    if (genHash(data.password + salt) !== hash)
        return new apiActionConclusion({ summaryOfQueryIfNotSuccess: Messages.passIncorrect });

    return new apiActionConclusion({ bottomLine: true });
}


async function changePassword({ username, data }) {
    let valResult = validateKeysAndValuesWrapper(data, validKeys.changePassword);
    if (valResult)
        return valResult;

    let salt = genSalt();
    let hash = genHash(data.password + salt);
    let result = await sequelizeWrapper(users.update.bind(users), { salt, hash }, { where: { username } });

    if (result)
        return new apiActionConclusion({ bottomLine: true });
}

async function updateUserInfo({ username, data }) {
    let valResult = validateKeysAndValuesWrapper(data, validKeys.updateUser, false);
    if (valResult)
        return valResult;

    if (await sequelizeWrapper(users.update, data, { where: { username } }))
        return new apiActionConclusion({ bottomLine: true });
}


function validateKeysAndValuesWrapper(data, properKeys, checkEqualKeyLength = true) {
    if (Object.keys(data).length > properKeys.length)
        return new apiActionConclusion({ summaryOfQueryIfNotSuccess: Messages.tooManyKeys });
    if (checkEqualKeyLength && properKeys.length !== Object.keys(data).length)
        return new apiActionConclusion({ summaryOfQueryIfNotSuccess: Messages.insufInfo });

    let inputValidation = validateKeysAndValues(data, properKeys);
    if (inputValidation.invalidKeys || inputValidation.invalidValues)
        return new apiActionConclusion(Object.assign({}, inputValidation));
}

users.findAll().then(val=>{
    console.log(val);
})


async function sequelizeWrapper(model, func, ...args) {
    console.log(`   ---starting sequelize query: ${func.name}`);
    let time = Date.now();
    let result = await func(...args);
    console.log(`      done with query ${func.name}. ${Date.now() - time}ms have passed ---`);
    return result;
}


// let g = {
//     age: 35,
//     first_name: "Ewinkg",
//     last_name: "Dodson",
//     gender_id: 0,
//     username: "Marijakkn",
//     password: "Robertklkls"
// };

// (async () => {
//     // console.log(await addUser(g));
//     console.log(await authenticateUser({
//         username: "Marijakkn",
//         password: "Robertklkls"
//     }));
//     console.log(await changePassword({
//         username: "Marijakkn",
//         data: { password: "jkjkjkjkjkjkj" }
//     }));
//     // console.log(await authenticateUser({
//     //     username: "Marijakkn",
//     //     password: "Robertklkls"
//     // }));
//     // console.log(await updateUserInfo({
//     //     username: "Mariakkn",
//     //     data: { first_name: "Kloopiii" }
//     // }));
// })();








