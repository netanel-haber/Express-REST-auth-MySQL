module.exports.DbActionConclusion = class {
    constructor({ results = null,
        summaryOfQueryIfNotSuccess = null,
        failedError = null,
        keyValidation = true,
        inputValidationSummaries = null }) {
        return {
            inputValidationGateway: { keyValidation: keyValidation, valueValidation: inputValidationSummaries },
            queryDescription: {
                results: results,
                summaryOfQueryIfNotSuccess: summaryOfQueryIfNotSuccess,
                failedError: failedError
            }
        };
    }
}
