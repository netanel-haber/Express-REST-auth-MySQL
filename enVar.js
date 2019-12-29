const envo = require('dotenv').config({ path: __dirname + '/.env' });
Object.keys(envo.parsed).forEach(env => {
    module.exports[env] = envo.parsed[env]
});



