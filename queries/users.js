const { users } = require('../users_db/models');
const { genHash, genSalt } = require('../utilities/hash_salt');
const { apiActionConclusion } = require('../db_action_conclusion');
const { Messages } = require('../users_db/Messages');

Object.assign(module.exports, {
    addUser, authenticateUser, changePassword, updateUserInfo
});

async function addUser(data) {
    if (await users.findOne({ where: { username: data.username } }))
        return new apiActionConclusion({ summaryOfQueryIfNotSuccess: Messages.userExists });

    let salt = genSalt();
    let hash = genHash(data.password + salt);
    delete data.password;

    Object.assign(data, { salt, hash });

    if (await users.create(data))
        return new apiActionConclusion({ bottomLine: true });
}

async function authenticateUser(data) {
    let result = await users.findOne({ where: { username: data.username } });
    if (!result)
        return new apiActionConclusion({ summaryOfQueryIfNotSuccess: Messages.userNotFound });

    let { hash, salt } = result;

    if (genHash(data.password + salt) !== hash)
        return new apiActionConclusion({ summaryOfQueryIfNotSuccess: Messages.passIncorrect });

    return new apiActionConclusion({ relevantResults: result.id });
}

async function changePassword({ decoded: id, data }) {
    let salt = genSalt();
    let hash = genHash(data.password + salt);
    let result = await users.update({ salt, hash }, { where: { id } });
    if (result)
        return new apiActionConclusion({ bottomLine: true });
}

async function updateUserInfo({ decoded: id, data }) {
    if (await users.update(data, { where: { id } }))
        return new apiActionConclusion({ bottomLine: true });
}












