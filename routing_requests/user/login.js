const executeAction = require('../../queries/queryWrapper');
const authenticateUser = require('../../queries/users');

const apiActionConclusion = require('../../db_action_conclusion');
const { genJwt } = require('../../utilities/jwt');


module.exports = async (req, res) => {
    const userDetails = req.body;

    let { statusCode, result } = await executeAction(authenticateUser, userDetails);
    if (statusCode !== 200) {
        res.status(statusCode).json(result);
        return;
    }

    let { relevantResults: user_id } = result;
    token = await genJwt(user_id, tokenExpirationString).catch(() => {
        statusCode = 500;
        result = null;
    });
    if (token) result = new apiActionConclusion({ relevantResults: token });
    res.status(statusCode).json(result);
};