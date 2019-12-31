import userInputValidation from './validation_config';
import validKeysInfo from './validation_config';
import apiActionConclusion from "../../db_action_conclusion";
import Messages from "../../users_db/Messages";

export default (actionName) => {
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
    let { validKeys, checkEqualKeyLength = true } = validKeysInfo;
    if (Object.keys(data).length > validKeys.length)
        return new apiActionConclusion({ summaryOfQueryIfNotSuccess: Messages.tooManyKeys });
    if (checkEqualKeyLength && validKeys.length !== Object.keys(data).length)
        return new apiActionConclusion({ summaryOfQueryIfNotSuccess: Messages.insufInfo });

    let inputValidation = userInputValidation(validKeys, data);
    if (inputValidation.invalidKeys || inputValidation.invalidValues)
        return new apiActionConclusion(Object.assign({}, inputValidation));
}