const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const { INSERT, SELECT, JWT } = require('./users/db_queries');
const { genJwt } = require('./users/hash_salt_jwt');


const port = 3000;
const app = express();
app.use(bodyParser.json());


app.post('/user/add', async (req, res) => {
    console.log("attempting to add user...");
    const userDetails = req.body;
    let { resCode, stringifiedResult } = await apiWrapper(INSERT.addUser, userDetails);
    console.log("user added succesfully.");
    res.statusCode = resCode;
    res.send(stringifiedResult);
});


app.post('/user/login', async (req, res) => {

    const userDetails = req.body;
    let { username } = userDetails;

    //authenticate
    let { resCode, stringifiedResult } = await apiWrapper(SELECT.authenticateUser, userDetails);
    if (resCode !== 200) {
        res.statusCode = resCode;
        res.send(stringifiedResult);
        return;
    }

    //authorize
    let result = await apiWrapper(genJwt, { username, expiresIn: '30s' })
    await apiWrapper(jwt)

    res.statusCode = result.resCode;
    res.send(result.stringifiedResult);
});





async function apiWrapper(action, data) {
    console.log(`--- attempting to ${action.name}. ---`);
    let log = `--- attempt to ${action.name} was successful ---`;

    let resCode = 200;
    let result;
    try {
        result = await action(data);
        if (!result.bottomLine) {
            resCode = 403;
            log = `--- attempt to ${action.name} was unsuccessful. client error. ${result.summaryOfQueryIfNotSuccess}. ---`
        }
    }
    catch (ex) {
        resCode = 500;
        result = null;

        log = `--- attempt to ${action.name} was unsuccessful. server error. ${JSON.stringify(ex)}. ---`;
    }
    let stringifiedResult = JSON.stringify(result);
    console.log(log);
    return { resCode, stringifiedResult };
}


app.listen(port, () => {
    console.log(`The server is running on port ${port}`);
});