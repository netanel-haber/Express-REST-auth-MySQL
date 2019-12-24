const port = 3000;
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { INSERT, SELECT, JWT } = require('./users/db_queries');
const jwt = require('jsonwebtoken');


app.use(bodyParser.json());


app.post('/user/add', async (req, res) => {
    const userDetails = req.body;
    let { resCode, stringifiedResult } = await queryWrapper(INSERT.addUser, userDetails);
    res.statusCode = resCode;
    res.send(stringifiedResult);
});

app.post('/user/login', async (req, res) => {
    const userDetails = req.body;
    let { username } = userDetails;

    //authenticate
    let { resCode, stringifiedResult } = await queryWrapper(SELECT.authenticateUser, userDetails);
    if (resCode !== 200) {
        res.statusCode = resCode;
        res.send(stringifiedResult); return;
    }

    //gen token
    jwt.sign({ username }, 'secretkey', { expiresIn: '10m' }, (err, token) => {
        res.json({
            token
        });
    });
});



async function queryWrapper(query, data) {
    let resCode = 200;
    let result;
    try {
        result = await query(data);
        if (!result.bottomLine)
            resCode = 403;
    }
    catch {
        resCode = 500;
        result = "";
    }
    let stringifiedResult = JSON.stringify(result);
    return { resCode, stringifiedResult };
}


app.listen(port, () => {
    console.log(`The server is running on port ${port}`);
});