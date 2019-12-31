const { validKeysInfo, userInputValidation } = require('./validation_config');
const apiActionConclusion = require("../../db_action_conclusion");
const Messages = require("../../users_db/Messages");

module.exports = (actionName) => {
    return (req, res, next) => {
        let result = validateKeysAndValuesWrapper(req.body, validKeysInfo[actionName]);
        if (result) {
            res.status(403).json(result);
        }
        else
            next();
    };
}

function validateKeysAndValuesWrapper(data, validKeysInfo) {
    let { keys: validKeys, checkLength: checkEqualKeyLength = true } = validKeysInfo;
    if (Object.keys(data).length > validKeys.length)
        return new apiActionConclusion({ summaryOfQueryIfNotSuccess: Messages.tooManyKeys });
    if (checkEqualKeyLength && validKeys.length !== Object.keys(data).length)
        return new apiActionConclusion({ summaryOfQueryIfNotSuccess: Messages.insufInfo });

    let inputValidation = userInputValidation(validKeys, data);
    if (inputValidation.invalidKeys || inputValidation.invalidValues)
        return new apiActionConclusion(Object.assign({}, inputValidation));
}