let jwt = require("jsonwebtoken");

Object.assign(module.exports, { jwtVerificationWrapper, genJwt, extractToken });

const secretKey = "secretKey";
function genJwt(username, expiresIn) {
    return new Promise((res, rej) => {
        jwt.sign({ username }, secretKey, { expiresIn: expiresIn }, (err, token) => {
            (err) ?
                rej(err) :
                res(token);
        });
    })
}

const messageIfCannotExtractToken = "CANNOT_EXTRACT_TOKEN";
const messageIfTokenExpired = "TOKEN_EXPIRED";
const defaultMessage = "INVALID_TOKEN";
function jwtVerificationWrapper(req) {
    console.log("verifying token...");
    return new Promise((res, rej) => {
        if (typeof req.token === undefined) {
            rej(messageIfCannotExtractToken);
            return;
        }
        jwt.verify(req.token, secretKey, (err, decoded) => {
            (err) ?
                rej(err.name === "TokenExpiredError" ?
                    messageIfTokenExpired : defaultMessage) :
                res(decoded);           
        });
    });
}

function extractToken(req, res, next) {
    console.log("extracting token...");
    let bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        let bearer = bearerHeader.split(' ');
        let bearerToken = bearer[1];
        req.token = bearerToken;        
    }
    next();
}
