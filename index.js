const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const {
    INSERT: { addUser },
    SELECT: { getValuesForFieldInTable, authenticateUser },
    UPDATE: { changePassword } } = require('./users/db_queries');
const { apiActionConclusion } = require('./users/db_action_conclusion');
const { jwtVerificationWrapper, genJwt, extractToken } = require('./jwt');

const port = 3000;
const app = express();
app.use(bodyParser.json());


app.post('/user/add', async (req, res) => {
    const userDetails = req.body;
    let { statusCode, result } = await apiWrapper(addUser, userDetails);
    res.status(statusCode).json(result);
});


app.post('/user/changePassword', extractToken, async (req, res) => {
    let result;
    if (decoded = await jwtVerificationWrapper(req).catch((err) => {
        statusCode = 403;
        result = new apiActionConclusion({ summaryOfQueryIfNotSuccess: err });
    }))
        ({ statusCode, result } = await apiWrapper(changePassword, Object.assign({ username: decoded.username }, req.body)));

    res.status(statusCode).json(result);
});



app.post('/user/login', async (req, res) => {
    const userDetails = req.body;
    let { username } = userDetails;
    let { statusCode, result } = await apiWrapper(authenticateUser, userDetails);
    if (statusCode !== 200) {
        res.status(statusCode).json(result);
        return;
    }
    token = await genJwt(username, '30s').catch(err => {
        statusCode = 500;
        result = null;
    });
    if (token) result = new apiActionConclusion({ relevantResults: token });
    res.status(statusCode).json(result);
});


async function apiWrapper(action, data) {
    console.log(`\n---\nattempting to ${action.name}\n`);
    let message = `attempt to ${action.name} was successful`;
    let statusCode = 200;
    let result;
    try {
        result = await action(data);
        if (!result.bottomLine) {
            statusCode = 403;
            message = `attempt to ${action.name} was unsuccessful. client error. ${result.summaryOfQueryIfNotSuccess}.`
        }
    }
    catch (ex) {
        statusCode = 500;
        result = null;
        message = `--- attempt to ${action.name} was unsuccessful. server error. ${JSON.stringify(ex)}. ---`;
    }
    console.log(`${message}\n---\n`);
    return { statusCode: statusCode, result };
}





app.listen(port, () => {
    console.log(`The server is running on port ${port}`);
});


