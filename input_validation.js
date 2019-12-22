
const RANGES = {
    username: { bottom: 6, top: 15 },
    name: { bottom: 2, top: 18 },
    password: { bottom: 8, top: 25 },
    age: { bottom: 18, top: 100 }
};

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
        test: str => /[a-zA-Z]/.test(str), message: () => "input can only contain letters."
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
            [...collectFlags(str, TEST_FOR.notNull, TEST_FOR.isString)]
        return new InputValidationSummary("name", raisedFlags.length === 0, raisedFlags);
    },
    username(str) {
        let raisedFlags = !FATAL_INPUT_FOR_STRING(str) ?
            [...collectFlags(str, TEST_FOR.notEmpty, TEST_FOR.noWhitespace, TEST_FOR.onlyLettersNumbersAndUnderScore),
            ...collectFlags([str, RANGES.username.bottom, RANGES.username.top], TEST_FOR.allowedStringRange)] :
            [...collectFlags(str, TEST_FOR.notNull, TEST_FOR.isString)];
        return new InputValidationSummary("userName", raisedFlags.length === 0, raisedFlags);
    },
    password(str) {
        let raisedFlags = !FATAL_INPUT_FOR_STRING(str) ?
            [...collectFlags(str, TEST_FOR.notEmpty, TEST_FOR.noWhitespace, TEST_FOR.onlyLettersNumbersAndUnderScore),
            ...collectFlags([str, RANGES.password.bottom, RANGES.password.top], TEST_FOR.allowedStringRange)] :
            [...collectFlags(str, TEST_FOR.notNull, TEST_FOR.isString)];
        return new InputValidationSummary("password", raisedFlags.length === 0, raisedFlags);
    },
    async gender_id(val) {
        let { getValuesForFieldInTable } = require("./users/db_queries");
        let raisedFlags = !FATAL_INPUT_FOR_NUMBER(val) ?
            [...collectFlags([val, ...await getValuesForFieldInTable("gender_id", "static_gender")], TEST_FOR.allowedNumberRange), ...collectFlags(val, TEST_FOR.notInteger)] :
            [...collectFlags(val, TEST_FOR.NaN)];
        return new InputValidationSummary("gender", raisedFlags.length === 0, raisedFlags);
    },
    age(val) {
        let raisedFlags = !FATAL_INPUT_FOR_NUMBER(val) ?
            [...collectFlags([val, RANGES.age.bottom, RANGES.age.top]), ...collectFlags(val, TEST_FOR.notInteger)] :
            [...collectFlags(val, TEST_FOR.NaN)];
        return new InputValidationSummary("age", raisedFlags.length === 0, raisedFlags);
    }
};

function collectFlags(args, ...lowLevelTests) {
    let flags = [];
    for (let test of lowLevelTests) {
        if (!test.test(args))
            flags.push(test.message(args.slice(1)));
    }
    return flags;
}

class InputValidationSummary {
    constructor(test, bottomLine, failedTests) {
        this.test = test;
        this.bottomLine = bottomLine;
        this.flagsRaised = failedTests;
    }
}

Object.assign(module.exports, {
    getTestForFieldName(fieldName) {
        for (let type of Object.keys(validation))
            if (fieldName.includes(type))
                return validation[type];
    },
    keyValidation(enteredKeys, properKeys, crossReference = false) {
        let result = true;
        enteredKeys.forEach(key => {
            if (properKeys.indexOf(key) === -1) result = false;
        });
        if (crossReference) {
            properKeys.forEach(key => {
                if (enteredKeys.indexOf(key) === -1) result = false;
            });
        }
        return result;
    }
});



//let f = (validation.gender(3));
// console.log(f);
