const executeAction = require('../../queries/queryWrapper');
const {changePassword} = require('../../queries/users');
module.exports = async (req, res) => {
    let { statusCode, result } = await executeAction(changePassword, req.bodyAfterTokenVerification);
    res.status(statusCode).json(result);
}