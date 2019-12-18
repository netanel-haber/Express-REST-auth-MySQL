let crypto = require('crypto');
let hash = crypto.createHash('sha256');

Object.assign(module.exports, {
    genHash(toHash) {
        return hash.update(toHash, 'utf-8').digest('hex');
    },
    genSalt() {
        return Math.random().toString(36).substring(2, 4) + Math.random().toString(36).substring(2, 15);
    }
});


//test hash and salt
// let password = ".azsdfasd"
// let salt = module.exports.genSalt();
// let hasy = module.exports.genHash(password + salt);
// console.log(`Salt=${salt}\nHash=${hasy}`);