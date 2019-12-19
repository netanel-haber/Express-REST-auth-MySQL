const BOTTOM_LIMIT_AGE = 18;
const TOP_LIMIT_AGE = 100;

const BOTTOM_LIMIT_USERNAME_LENGTH = 6;
const TOP_LIMIT_USERNAME_LENGTH = 15;

const BOTTOM_LIMIT_NAME_LENGTH = 2;
const TOP_LIMIT_NAME_LENGTH = 18;

const BOTTOM_LIMIT_PASSWORD_LENGTH = 8;
const TOP_LIMIT_PASSWORD_LENGTH = 25;

const FATAL_INPUT_FOR_STRING = str => (str === null) || (str + "" !== str);
const FATAL_INPUT_FOR_NUMBER = val => isNaN(val);


const TEST_FOR = {
    notNull: str => str !== null,
    isString: str => str === str + "",
    notEmpty: str => str !== "",
    noWhitespace: str => !/ /.test(str),
    onlyLetters: str => /[a-zA-Z]/.test(str),
    exceptFirstAllLowerCase: str => /^[A-Z][a-z]+/.test(str),
    allowedStringLength: ([str, bottomLimit, topLimit]) => (str.length <= topLimit) && (str.length >= bottomLimit),
    onlyLettersNumbersAndUnderScore: str => !(/\W/.test(str)),

    NaN: val => !isNaN(val),
    notInteger: val => Number.isInteger(val),
    numberNotInRange: ([val, lowerLimitInclude, UpperLimitInclude]) => (val <= UpperLimitInclude && val >= lowerLimitInclude)
};


Object.assign(module.exports, {
    validName(str) {
        let raisedFlags = !FATAL_INPUT_FOR_STRING(str) ?
            [...collectFlags(str, TEST_FOR.notEmpty, TEST_FOR.noWhitespace, TEST_FOR.onlyLetters, TEST_FOR.exceptFirstAllLowerCase),
            ...collectFlags([str, BOTTOM_LIMIT_NAME_LENGTH, TOP_LIMIT_NAME_LENGTH], TEST_FOR.allowedStringLength)] :
            [...collectFlags(str, TEST_FOR.notNull, TEST_FOR.isString)]
        return new ValidationInputSummary("name", raisedFlags.length === 0, raisedFlags);
    },
    validUserName(str) {
        let raisedFlags = !FATAL_INPUT_FOR_STRING(str) ?
            [...collectFlags(str, TEST_FOR.notEmpty, TEST_FOR.noWhitespace, TEST_FOR.onlyLettersNumbersAndUnderScore),
            ...collectFlags([str, BOTTOM_LIMIT_USERNAME_LENGTH, TOP_LIMIT_USERNAME_LENGTH], TEST_FOR.allowedStringLength)] :
            [...collectFlags(str, TEST_FOR.notNull, TEST_FOR.isString)];
        return new ValidationInputSummary("userName", raisedFlags.length === 0, raisedFlags);
    },
    validPassword(str) {
        let raisedFlags = !FATAL_INPUT_FOR_STRING(str) ?
            [...collectFlags(str, TEST_FOR.notEmpty, TEST_FOR.noWhitespace, TEST_FOR.onlyLettersNumbersAndUnderScore),
            ...collectFlags([str, BOTTOM_LIMIT_PASSWORD_LENGTH, TOP_LIMIT_PASSWORD_LENGTH], TEST_FOR.allowedStringLength)] :
            [...collectFlags(str, TEST_FOR.notNull, TEST_FOR.isString)];
        return new ValidationInputSummary("password", raisedFlags.length === 0, raisedFlags);
    },

    validGender(val, allowedVals) {
        let raisedFlags = !FATAL_INPUT_FOR_NUMBER(val) ?
            [...collectFlags([val, ...allowedVals], TEST_FOR.numberNotInRange), ...collectFlags(val, TEST_FOR.notInteger)] :
            [...collectFlags(val, TEST_FOR.NaN)];
        return new ValidationInputSummary("gender", raisedFlags.length === 0, raisedFlags);
    },
    validAge(val) {
        let raisedFlags = !FATAL_INPUT_FOR_NUMBER(val) ?
            [...collectFlags([val, BOTTOM_LIMIT_AGE, TOP_LIMIT_AGE], TEST_FOR.numberNotInRange), ...collectFlags(val, TEST_FOR.notInteger)] :
            [...collectFlags(val, TEST_FOR.NaN)];
        return new ValidationInputSummary("age", raisedFlags.length === 0, raisedFlags);
    }
});

function collectFlags(args, ...lowLevelTests) {
    let flags = [];
    for (let test of lowLevelTests) {
        if (!test(args))
            flags.push(test.name);
    }
    return flags;
}

class ValidationInputSummary {
    constructor(test, bottomLine, failedTests) {
        this.test = test;
        this.bottomLine = bottomLine;
        this.flagsRaised = failedTests;
    }
}


// let f = (module.exports.passWord("sdfa412"));
// console.log(f);

