const collectFlags = require("../validationTools").collectFlags;
const KeyAndValueValidationFunctionFactory = require("../validationTools").KeyAndValueValidationFunctionFactory;
const InputValidationSummary = require('../InputValidationSummary');

const RANGES = {
    username: { bottom: 6, top: 15 },
    name: { bottom: 2, top: 18 },
    password: { bottom: 8, top: 25 },
    age: { bottom: 18, top: 100 }
};


const validGender_ids = [0, 1];

const FATAL_INPUT_FOR_STRING = str => (str === null) || (str + "" !== str);
const FATAL_INPUT_FOR_NUMBER = val => isNaN(val);


const lowerLevelTests = {
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

let higherLevelTests = {
    name(str) {
        let raisedFlags = !FATAL_INPUT_FOR_STRING(str) ?
            [...collectFlags(str, lowerLevelTests.notEmpty, lowerLevelTests.noWhitespace, lowerLevelTests.onlyLetters, lowerLevelTests.exceptFirstAllLowerCase),
            ...collectFlags([str, RANGES.name.bottom, RANGES.name.top], lowerLevelTests.allowedStringRange)] :
            [...collectFlags(str, lowerLevelTests.notNull, lowerLevelTests.isString)];
        return (raisedFlags.length === 0) ? null : new InputValidationSummary("name: " + str, raisedFlags);
    },
    username(str) {
        let raisedFlags = !FATAL_INPUT_FOR_STRING(str) ?
            [...collectFlags(str, lowerLevelTests.notEmpty, lowerLevelTests.noWhitespace, lowerLevelTests.onlyLettersNumbersAndUnderScore),
            ...collectFlags([str, RANGES.username.bottom, RANGES.username.top], lowerLevelTests.allowedStringRange)] :
            [...collectFlags(str, lowerLevelTests.notNull, lowerLevelTests.isString)];
        return (raisedFlags.length === 0) ? null : new InputValidationSummary("username: " + str, raisedFlags);
    },
    password(str) {
        let raisedFlags = !FATAL_INPUT_FOR_STRING(str) ?
            [...collectFlags(str, lowerLevelTests.notEmpty, lowerLevelTests.noWhitespace, lowerLevelTests.onlyLettersNumbersAndUnderScore),
            ...collectFlags([str, RANGES.password.bottom, RANGES.password.top], lowerLevelTests.allowedStringRange)] :
            [...collectFlags(str, lowerLevelTests.notNull, lowerLevelTests.isString)];
        return (raisedFlags.length === 0) ? null : new InputValidationSummary("password: " + str, raisedFlags);
    },
    gender_id(val) {
        let raisedFlags = !FATAL_INPUT_FOR_NUMBER(val) ?
            [...collectFlags([val, ...validGender_ids], lowerLevelTests.allowedNumberRange), ...collectFlags(val, lowerLevelTests.notInteger)] :
            [...collectFlags(val, lowerLevelTests.NaN)];
        return (raisedFlags.length === 0) ? null : new InputValidationSummary("gender id: " + val, raisedFlags);
    },
    age(val) {
        let raisedFlags = !FATAL_INPUT_FOR_NUMBER(val) ?
            [...collectFlags([val, RANGES.age.bottom, RANGES.age.top], lowerLevelTests.allowedNumberRange), ...collectFlags(val, lowerLevelTests.notInteger)] :
            [...collectFlags(val, lowerLevelTests.NaN)];
        return (raisedFlags.length === 0) ? null : new InputValidationSummary("age: " + val, raisedFlags);
    }
};


module.exports.validKeysInfo = {
    addUser: { keys: ["first_name", "last_name", "age", "gender_id", "password", "username"] },
    login: { keys: ["username", "password"] },
    changePassword: { keys: ["password"] },
    updateUser: { checkLength: false, keys: ["first_name", "last_name", "age", "gender_id"] }
};


module.exports.userInputValidation = (validKeys, data) => {
    return KeyAndValueValidationFunctionFactory(higherLevelTests, validKeys)(data);
}


