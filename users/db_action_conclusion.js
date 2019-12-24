module.exports.DbActionConclusion = class {
    constructor({
        bottomLine = false,
        relevantResults = null,
        summaryOfQueryIfNotSuccess = null,
        invalidKeys = null,
        invalidValues = null
    }) {
        return {
            bottomLine: bottomLine,
            relevantResults: relevantResults,
            invalidKeys: invalidKeys,
            invalidValues: invalidValues,
            summaryOfQueryIfNotSuccess: summaryOfQueryIfNotSuccess,
        }
    };
}

