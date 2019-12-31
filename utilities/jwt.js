const jwt = require("jsonwebtoken");
const apiActionConclusion = require('../db_action_conclusion');

Object.assign(module.exports, { genJwt, extractToken, verifyToken });

const secretKey = "secretKey";
function genJwt(payload, expiresIn) {
    return new Promise((res, rej) => {
        jwt.sign({ payload }, secretKey, { expiresIn: expiresIn }, (err, token) => {
            (err) ?
                rej(err) :
                res(token);
        });
    })
}

const messageIfTokenExpired = "TOKEN_EXPIRED";
const defaultMessage = "INVALID_TOKEN";
function verifyToken(req, res, next) {
    jwt.verify(req.token, secretKey, (err, decoded) => {
        if (err) {
            res.status(403).json(new apiActionConclusion({
                summaryOfQueryIfNotSuccess: err.name === "TokenExpiredError" ?
                    messageIfTokenExpired : defaultMessage
            }));
        }
        else {
            req.bodyAfterTokenVerification = {
                decoded: decoded.payload, data: req.body
            };
            next();
        }
    });
}

const messageIfCannotExtractToken = "CANNOT_EXTRACT_TOKEN";
function extractToken(req, res, next) {
    console.log("extracting token...");
    let bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        let bearer = bearerHeader.split(' ');
        let bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }
    else {
        res.status(403).json(new apiActionConclusion({ summaryOfQueryIfNotSuccess: messageIfCannotExtractToken }));
    }
}
