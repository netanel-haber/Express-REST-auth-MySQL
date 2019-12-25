module.exports.apiActionConclusion = class {
    constructor({
        bottomLine = false,
        relevantResults = null,
        summaryOfQueryIfNotSuccess = null,
        invalidKeys = null,
        invalidValues = null
    }) {
        return {
            bottomLine: relevantResults !== null || bottomLine,
            relevantResults: relevantResults,
            invalidKeys: invalidKeys,
            invalidValues: invalidValues,
            summaryOfQueryIfNotSuccess: summaryOfQueryIfNotSuccess,
        }
    };
}


