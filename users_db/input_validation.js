const RANGES = {
    username: { bottom: 6, top: 15 },
    name: { bottom: 2, top: 18 },
    password: { bottom: 8, top: 25 },
    age: { bottom: 18, top: 100 }
};

const validGender_ids = [0, 1];

const { apiActionConclusion } = require('../db_action_conclusion');

const FATAL_INPUT_FOR_STRING = str => (str === null) || (str + "" !== str);
const FATAL_INPUT_FOR_NUMBER = val => isNaN(val);


const TEST_FOR = {
    notNull: {
        test: str => str !== null, message: () => "input cannot be null."
    },
    isString: {
        test: str => str === str + "", message: () => "input must be of string form."
    },
    notEmpty: {
        test: str => str !== "", message: () => "input cannot be empty."
    },
    noWhitespace: {
        test: str => !/ /.test(str), message: () => "input cannot contain whitespace."
    },
    onlyLetters: {
        test: str => /^[a-zA-Z]+$/.test(str), message: () => "input can only contain letters."
    },
    exceptFirstAllLowerCase: {
        test: str => /^[A-Z][a-z]+/.test(str), message: () => "input must be so that the first letter is uppercase, while all other letters are lowercase."
    },
    allowedStringRange: {
        test: ([str, bottomLimit, topLimit]) => (str.length <= topLimit) && (str.length >= bottomLimit), message: ([bottomLimit, topLimit]) => `input must fall between ${bottomLimit} and ${topLimit} (incl.).`
    },
    onlyLettersNumbersAndUnderScore: {
        test: str => !(/\W/.test(str)), message: () => "input must conatin only letters, numbers, and the underscore symbol."
    },
    NaN: {
        test: val => !isNaN(val), message: () => "input must be a number."
    },
    notInteger: {
        test: val => Number.isInteger(val), message: () => "input must be an integer."
    },
    allowedNumberRange: {
        test: ([val, lowerLimitInclude, upperLimitInclude]) => (val <= upperLimitInclude && val >= lowerLimitInclude), message: ([bottomLimit, topLimit]) => `input must fall between ${bottomLimit} and ${topLimit} (incl.).`
    }
};

validation = {
    name(str) {
        let raisedFlags = !FATAL_INPUT_FOR_STRING(str) ?
            [...collectFlags(str, TEST_FOR.notEmpty, TEST_FOR.noWhitespace, TEST_FOR.onlyLetters, TEST_FOR.exceptFirstAllLowerCase),
            ...collectFlags([str, RANGES.name.bottom, RANGES.name.top], TEST_FOR.allowedStringRange)] :
            [...collectFlags(str, TEST_FOR.notNull, TEST_FOR.isString)];
        return (raisedFlags.length === 0) ? null : new InputValidationSummary("name: " + str, raisedFlags);
    },
    username(str) {
        let raisedFlags = !FATAL_INPUT_FOR_STRING(str) ?
            [...collectFlags(str, TEST_FOR.notEmpty, TEST_FOR.noWhitespace, TEST_FOR.onlyLettersNumbersAndUnderScore),
            ...collectFlags([str, RANGES.username.bottom, RANGES.username.top], TEST_FOR.allowedStringRange)] :
            [...collectFlags(str, TEST_FOR.notNull, TEST_FOR.isString)];
        return (raisedFlags.length === 0) ? null : new InputValidationSummary("username: " + str, raisedFlags);
    },
    password(str) {
        let raisedFlags = !FATAL_INPUT_FOR_STRING(str) ?
            [...collectFlags(str, TEST_FOR.notEmpty, TEST_FOR.noWhitespace, TEST_FOR.onlyLettersNumbersAndUnderScore),
            ...collectFlags([str, RANGES.password.bottom, RANGES.password.top], TEST_FOR.allowedStringRange)] :
            [...collectFlags(str, TEST_FOR.notNull, TEST_FOR.isString)];
        return (raisedFlags.length === 0) ? null : new InputValidationSummary("password: " + str, raisedFlags);
    },
    gender_id(val) {
        let raisedFlags = !FATAL_INPUT_FOR_NUMBER(val) ?
            [...collectFlags([val, ...validGender_ids], TEST_FOR.allowedNumberRange), ...collectFlags(val, TEST_FOR.notInteger)] :
            [...collectFlags(val, TEST_FOR.NaN)];
        return (raisedFlags.length === 0) ? null : new InputValidationSummary("gender id: " + val, raisedFlags);
    },
    age(val) {
        let raisedFlags = !FATAL_INPUT_FOR_NUMBER(val) ?
            [...collectFlags([val, RANGES.age.bottom, RANGES.age.top], TEST_FOR.allowedNumberRange), ...collectFlags(val, TEST_FOR.notInteger)] :
            [...collectFlags(val, TEST_FOR.NaN)];
        return (raisedFlags.length === 0) ? null : new InputValidationSummary("age: " + val, raisedFlags);
    }
};

function collectFlags(args, ...lowLevelTests) {
    let flags = [];
    for (let test of lowLevelTests) {
        if (test.test(args) === false)
            flags.push(test.message(args.slice(1)));
    }
    return flags;
}

class InputValidationSummary {
    constructor(test, failedTests) {
        this.test = test;
        this.flagsRaised = failedTests;
    }
}

function getTestForFieldName(fieldName) {
    let test;
    try {
        test = validation[fieldName] ? validation[fieldName] : validation[Object.keys(validation).filter(test => fieldName.includes(test))[0]];
    }
    catch {
        test = null;
    }
    return test;
}

function keyValidation(enteredKeys, properKeys) {
    let results = [];
    enteredKeys.forEach(key => {
        if (properKeys.indexOf(key) === -1) results.push(key);
    });
    return results.length > 0 ? results : null;
}

function valueValidation(data) {
    let failedHighLevelTests = [];
    Object.keys(data).forEach(key => {
        let test = getTestForFieldName(key);
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

function validateKeysAndValues(data, actualKeys) {
    let accumulatedDbInfo = {};
    let invalidKeys = keyValidation(Object.keys(data), actualKeys),
        invalidValues = valueValidation(data);
    if (invalidKeys)
        Object.assign(accumulatedDbInfo, { invalidKeys });
    if (invalidValues)
        Object.assign(accumulatedDbInfo, { invalidValues });
    return accumulatedDbInfo;
}

function validateKeyValuePair(data) {
    let key = Object.keys(data)[0];
    let value = Object.values(data)[0];
    let test = getTestForFieldName(key);
    if (test) {
        let result = test(value);
        if (!result)
            result = [];
    }
    else
        result = "";
    return result;
}

function valKeyValuePairWrapper(data) {
    result = validateKeyValuePair(data);
    if (!result)
        return new apiActionConclusion({ summaryOfQueryIfNotSuccess: Messages.noTestForField });
    return new apiActionConclusion({ relevantResults: result.length > 0 ? result : null });
}


Object.assign(module.exports, {
    validateKeysAndValues,
    valKeyValuePairWrapper,
    validKeys: {
        addUser: ["first_name", "last_name", "age", "gender_id", "password", "username"],
        authenticateUser: ["username", "password"],
        changePassword: ["password"],
        updateUser: ["first_name", "last_name", "age", "gender_id"]
    }
});

//        "getModels": "sequelize-auto -h nodetest.cfqshdcm1tco.eu-west-1.rds.amazonaws.com -d users -u admin -x froopigloopi -p 3306  --dialect mysql -o C:\\Users\\viren\\Documents\\GitHub\\User_Account_Signin\\users_db\\sequelize\\models",


