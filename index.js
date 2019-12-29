const express = require('express');
const bodyParser = require('body-parser');
const { MYSQL_PASSWORD, MYSQL_HOST, MYSQL_USERNAME } = require('./enVar');


const {
    INSERT: { addUser },
    SELECT: { authenticateUser },
    UPDATE: { changePassword, updateUserInfo } } = require('./users_db/queries');
const { valKeyValuePairWrapper } = require('./users_db/input_validation');
const { apiActionConclusion } = require('./db_action_conclusion');
const { jwtVerificationWrapper, genJwt, extractToken } = require('./utilities/jwt');

const port = 3000;
const app = express();
app.use(bodyParser.json());

app.post('/user/add', async (req, res) => {
    let { statusCode, result } = await executeAction(addUser, req.body);
    res.status(statusCode).json(result);
});

app.post('/user/changePassword', extractToken, async (req, res) => {
    let { statusCode, result } = await verifyTokenThenExecuteAction(req, changePassword, req.body);
    res.status(statusCode).json(result);
});

app.post('/user/updateInfo', extractToken, async (req, res) => {
    let { statusCode, result } = await verifyTokenThenExecuteAction(req, updateUserInfo, req.body);
    res.status(statusCode).json(result);
});


const tokenExpirationString = "90s";
app.post('/user/login', async (req, res) => {
    const userDetails = req.body;

    let { statusCode, result } = await executeAction(authenticateUser, userDetails);
    if (statusCode !== 200) {
        res.status(statusCode).json(result);
        return;
    }

    let { username } = req.body;
    token = await genJwt(username, tokenExpirationString).catch(() => {
        statusCode = 500;
        result = null;
    });
    if (token) result = new apiActionConclusion({ relevantResults: token });
    res.status(statusCode).json(result);
});

app.get('/api/validateSingleKeyValuePair', async (req, res) => {
    const data = req.body;
    let { statusCode, result } = await executeAction(valKeyValuePairWrapper, data);
    res.status(statusCode).json(result);
});



async function verifyTokenThenExecuteAction(req, action, data) {
    let result;
    let decoded = await jwtVerificationWrapper(req).catch((err) => {
        statusCode = 403;
        result = new apiActionConclusion({ summaryOfQueryIfNotSuccess: err });
    });
    if (typeof decoded !== 'undefined')
        ({ statusCode, result } = await executeAction(action, { username: decoded.username, data }));
    return { statusCode, result };
}

async function executeAction(action, data) {
    console.log(`\n---\nattempting to ${action.name}...\n`);
    let time = Date.now();
    let message = `attempt to ${action.name} was successful`;
    let statusCode = 200;
    let result = null;
    try {
        result = await action(data);
        if (!result.bottomLine) {
            statusCode = 403;
            message = `attempt to ${action.name} was unsuccessful. client error. ${result.summaryOfQueryIfNotSuccess}.`
        }
    }
    catch (ex) {
        statusCode = 500;
        message = `--- attempt to ${action.name} was unsuccessful. server error. ${JSON.stringify(ex)}. ---`;
    }
    console.log(`\n${message}\n`);
    console.log(`${Date.now() - time}ms have passed\n---\n`);

    return { statusCode: statusCode, result };
}


app.listen(port, () => {
    console.log(`The server is running on port ${port}`);
});


