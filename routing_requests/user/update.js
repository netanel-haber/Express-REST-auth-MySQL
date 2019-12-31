import executeAction from '../../queries/queryWrapper';
import updateUserInfo from '../../queries/users';

export default async (req, res) => {
    let { statusCode, result } = await executeAction(updateUserInfo, req.bodyAfterTokenVerification);
    res.status(statusCode).json(result);
};