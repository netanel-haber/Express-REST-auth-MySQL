export default class InputValidationSummary {
    constructor(test, failedTests) {
        this.test = test;
        this.flagsRaised = failedTests;
    }
}