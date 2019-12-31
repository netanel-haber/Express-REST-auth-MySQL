const { valKeyValuePairWrapper } = require('./users_db/input_validation');
app.get('/api/validateSingleKeyValuePair', async (req, res) => {
    const data = req.body;
    let { statusCode, result } = await executeAction(valKeyValuePairWrapper, data);
    res.status(statusCode).json(result);
});