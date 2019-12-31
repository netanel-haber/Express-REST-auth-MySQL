module.exports = class InputValidationSummary {
    constructor(test, failedTests) {
        this.test = test;
        this.flagsRaised = failedTests;
    }
}