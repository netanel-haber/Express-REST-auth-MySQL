module.exports.queryConclusion = (results = null, summaryOfQueryIfNotSuccess = null, failedError = null) => {
    return {
        results: results,
        summaryOfQueryIfNotSuccess: summaryOfQueryIfNotSuccess,
        failedError: failedError
    };
}