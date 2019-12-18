let crypto = require('crypto');
let hash = crypto.createHash('sha256');

Object.assign(module.exports, {
    hashFunc(toHash) {
        return hash.update(toHash, 'utf-8').digest('hex');
    },
    genSalt() {
        return Math.random().toString(36).substring(2, 4) + Math.random().toString(36).substring(2, 15);
    }
});

console.log(module.exports.genSalt());