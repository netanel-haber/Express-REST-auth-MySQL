module.exports.DbActionConclusion = class {
    constructor({
        results = null,
        summaryOfQueryIfNotSuccess = null,
        failedError = null,
        invalidKeys = null,
        inputValidationSummaries = null
    }) {
        return {
            results: results,
            keyValidation: invalidKeys,
            valueValidation: inputValidationSummaries,
            summaryOfQueryIfNotSuccess: summaryOfQueryIfNotSuccess,
            failedError: failedError
        }
    };
}

