const port = 3000;
const express = require('express');
const bodyParser = require('body-parser');
const {addUser} = require('./users/db_queries');

const app = express();

app.use(bodyParser.json());

app.get('/user/:userId/details', (req, res) => {
    // const userId = req.params.userId;
    // let userDetails = usersManager.getUserById(userId).then((userDetails) => {
    //     let responseObj = {};
    //     if (!userDetails) {
    //         res.statusCode = 403;
    //         responseObj.data = null;
    //         responseObj.error = "user not found"
    //     } else {
    //         responseObj.data = userDetails;
    //         responseObj.error = null;
    //     }
    //     responseObj = JSON.stringify(responseObj);
    //     res.send(responseObj);
});

(async function testQueriesDev() {
    // // console.log(await queryTheDB("asdfas"));
    //console.log(await module.exports.authenticateUser({ username: "yochai", password: ".azdfasd" }));

    // let arr =[];
    // console.log(JSON.stringify({x:"y", y:"x"},(_,key,value)=>{
    //     arr.push({key,value});
    // }));
    //module.exports.addUser({ x: 1, y: 2, password: "donaldDuck" });
    //module.exports.getAllRelevantUserFields();
    try {
        //await module.exports.getValuesForFieldInTable("gender_id", "static_gender");
       let g =9; //return await module.exports.authenticateUser({ username: "yochai", password: "kkkzdfasd" });
        await addUser({ username: "malchiel", password: "elmlagchid", first_name: "Ffff", last_name: "Ruchi",  age: 23, gender_id: 0, });
    }

    catch (ex) {
        console.log("sdf");
    }
})();

app.post('/user/details/add', (req, res) => {
    const userDetails = req.body;
    usersManager.addUser(userDetails).then((userDetails) => {
        console.log(userDetails);
        res.send(JSON.stringify(userDetails));
    });
});

app.post('/user/login', (req, res) => {
    const userDetails = req.body;
    usersManager.addUser(userDetails).then((userDetails) => {
        console.log(userDetails);
        res.send(JSON.stringify(userDetails));
    });
});


app.get('/user/details', (req, res) => {
    const userDetails = req.body;
    usersManager.addUser(userDetails).then((userDetails) => {
        console.log(userDetails);
        res.send(JSON.stringify(userDetails));
    });
});


app.listen(port, () => {
    console.log(`The server is running on port ${port}`);
});