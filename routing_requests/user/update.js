const executeAction = require('../../queries/queryWrapper');
const {updateUserInfo} = require('../../queries/users');

module.exports = async (req, res) => {
    let { statusCode, result } = await executeAction(updateUserInfo, req.bodyAfterTokenVerification);
    res.status(statusCode).json(result);
};