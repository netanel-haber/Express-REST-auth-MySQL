const executeAction = require('../../queries/queryWrapper');
const addUser = require('../../queries/users');

module.exports = async (req, res) => {
    let { statusCode, result } = await executeAction(addUser, req.body);
    res.status(statusCode).json(result);
}