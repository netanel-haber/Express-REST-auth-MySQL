const apiActionConclusion = require('../db_action_conclusion');


let keyValidation = (enteredKeys, properKeys) => {
    let results = [];
    enteredKeys.forEach(key => {
        if (properKeys.indexOf(key) === -1) results.push(key);
    });
    return results.length > 0 ? results : null;
}
let valueValidation = (data, higherLevelTests) => {
    let failedHighLevelTests = [];
    Object.keys(data).forEach(key => {
        let test = getTestForFieldName(key, higherLevelTests);
        if (test) {
            let result = test(data[key])
            if (result)
                failedHighLevelTests.push(result);
        }
        else
            failedHighLevelTests.push(`Could not find test for ${key}`);
    });
    return failedHighLevelTests.length > 0 ? failedHighLevelTests : null;
}

let getTestForFieldName = (fieldName, higherLevelTests) => {
    let test;
    try {
        test = higherLevelTests[fieldName] ? higherLevelTests[fieldName] : higherLevelTests[Object.keys(higherLevelTests).filter(test => fieldName.includes(test))[0]];
    }
    catch (ex) {
        test = null;
    }
    return test;
}


let validateKeysAndValues = function (data, actualKeys, higherLevelTests) {
    let accumulatedDbInfo = {};
    let invalidKeys = keyValidation(Object.keys(data), actualKeys),
        invalidValues = valueValidation(data, higherLevelTests);
    if (invalidKeys)
        Object.assign(accumulatedDbInfo, { invalidKeys });
    if (invalidValues)
        Object.assign(accumulatedDbInfo, { invalidValues });
    return accumulatedDbInfo;
}


let validateKeyValuePair = (data) => {
    let key = Object.keys(data)[0];
    let value = Object.values(data)[0];
    let test = getTestForFieldName(key, tests);
    if (test) {
        let result = test(value);
        if (!result)
            result = [];
    }
    else
        result = `Could not find test for ${key}`;
    return result;
}

let valKeyValuePairWrapper = (data) => {
    result = validateKeyValuePair(data);
    if (!result)
        return new apiActionConclusion({ summaryOfQueryIfNotSuccess: Messages.noTestForField });
    return new apiActionConclusion({ relevantResults: result.length > 0 ? result : null });
}

module.exports.collectFlags = (args, ...lowLevelTests) => {
    let flags = [];
    for (let test of lowLevelTests) {
        if (test.test(args) === false)
            flags.push(test.message(args.slice(1)));
    }
    return flags;
}

module.exports.KeyAndValueValidationFunctionFactory = (higherLevelTests, validKeys) => {
    return (data) => {
        return validateKeysAndValues(data, validKeys, higherLevelTests);
    }
}


