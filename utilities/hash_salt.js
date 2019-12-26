let crypto = require('crypto');
const saltLength = 8;

Object.assign(module.exports, {
    genHash(toHash) {
        return crypto.createHash('sha256').update(toHash, 'utf-8').digest('hex');
    },
    genSalt() {
        return crypto.randomBytes(Math.ceil(saltLength / 2))
            .toString('hex')
            .slice(0, saltLength);
    },
});


//test hash and salt
// let password = ".azsdfasd"
// let salt = module.exports.genSalt();
// let hasy = module.exports.genHash(password + salt);
// console.log(`Salt=${salt}\nHash=${hasy}`);