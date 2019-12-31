import executeAction from '../../queries/queryWrapper';
import addUser from '../../queries/users';

export default async (req, res) => {
    let { statusCode, result } = await executeAction(addUser, req.body);
    res.status(statusCode).json(result);
}