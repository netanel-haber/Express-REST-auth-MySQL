import executeAction from '../../queries/queryWrapper';
import changePassword from '../../queries/users';

export default async (req, res) => {
    let { statusCode, result } = await executeAction(changePassword, req.bodyAfterTokenVerification);
    res.status(statusCode).json(result);
}