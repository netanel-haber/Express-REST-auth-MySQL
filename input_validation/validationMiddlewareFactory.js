const { validKeysInfo, userInputValidation } = require('./users_db/validation_config');
const apiActionConclusion = require("../db_action_conclusion");
const Messages = require("../users_db/Messages");

module.exports = (actionName) => {
    return (req, res, next) => {
        try {
            let result = validateKeysAndValuesWrapper(req.body, validKeysInfo[actionName]);
            console.log(result);
            result ? res.status(403).json(result) : next();
        }
        catch (ex) {
            console.log(ex);
            res.status(500).json(null);
        }
    };
}

function validateKeysAndValuesWrapper(data, validKeysInfo) {
    let { keys: validKeys, checkLength: checkEqualKeyLength = true } = validKeysInfo;

    const errorMessage = (message) => {
        return {
            error: message,
            validKeys: [...validKeys]
        }
    };


    if (Object.keys(data).length > validKeys.length)
        return new apiActionConclusion({ summaryOfQueryIfNotSuccess: errorMessage('TOO_MANY_KEYS') });
    else if (checkEqualKeyLength && validKeys.length !== Object.keys(data).length)
        return new apiActionConclusion({ summaryOfQueryIfNotSuccess: errorMessage('NOT_ENOUGH_KEYS') });

    let inputValidation = userInputValidation(validKeys, data);
    if (inputValidation.invalidKeys || inputValidation.invalidValues)
        return new apiActionConclusion({
            summaryOfQueryIfNotSuccess: Object.assign(errorMessage('INVALID_KEYS'), inputValidation)
        });
}