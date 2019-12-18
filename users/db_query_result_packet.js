module.exports.generateQueryDescriptor = (sqlResults, resultErrorCode = 0) => {
    return {
        results: sqlResults,
        resultErrorCode: resultErrorCode
    };
}