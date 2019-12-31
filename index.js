const express = require('express');
const bodyParser = require('body-parser');
const slashUser = require('./routing_requests/user/slash_user.js');
const slashApi = require('./routing_requests/user/slash_user.js')

const port = 3000;
const app = express();

app.use(bodyParser.json());
app.use('/user', slashUser);
app.use('/api', slashApi)

app.listen(port, () => {
    console.log(`The server is running on port ${port}`);
});







