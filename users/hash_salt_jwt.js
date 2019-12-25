let crypto = require('crypto');
let jwt = require("jsonwebtoken");
let { DbActionConclusion } = require("./db_action_conclusion");
const saltLength = 8;

Object.assign(module.exports, {
    genHash(toHash) {
        return crypto.createHash('sha256').update(toHash, 'utf-8').digest('hex');
    },
    genSalt() {
        return crypto.randomBytes(Math.ceil(saltLength / 2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0, saltLength);   /** return required number of characters */
    },
    genJwt({ username, expiresIn }) {
        return new Promise((res) => {
            jwt.sign({ username }, module.exports.genSalt(), { expiresIn: expiresIn }, (err, token) => {
                if (err)
                    throw err;
                res(new DbActionConclusion({ bottomLine: true, relevantResults: token }));
            });
        })
    }
});


//test hash and salt
// let password = ".azsdfasd"
// let salt = module.exports.genSalt();
// let hasy = module.exports.genHash(password + salt);
// console.log(`Salt=${salt}\nHash=${hasy}`);