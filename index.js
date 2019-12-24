const port = 3000;
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { INSERT, SELECT } = require('./users/db_queries');

app.use(bodyParser.json());


// (async function testQueriesDev() {
//     // // console.log(await queryTheDB("asdfas"));
//     //console.log(await module.exports.authenticateUser({ username: "yochai", password: ".azdfasd" }));

//     // let arr =[];
//     // console.log(JSON.stringify({x:"y", y:"x"},(_,key,value)=>{
//     //     arr.push({key,value});
//     // }));
//     //module.exports.addUser({ x: 1, y: 2, password: "donaldDuck" });
//     //module.exports.getAllRelevantUserFields();
//     try {
//         //await module.exports.getValuesForFieldInTable("gender_id", "static_gender");
//         let g = 9; //return await module.exports.authenticateUser({ username: "yochai", password: "kkkzdfasd" });
//         //console.log(await INSERT.addUser({ username: "malchiel", password: "*elmlagchid", first_name: "Ffff", last_name: "Ruchi", age: 23, gender_id: 0, }));
//         console.log(await SELECT.authenticateUser({ username: "malllchiel", password: "huhuuihiuh"}));
//     }

//     catch (ex) {
//         console.log(ex);
//     }
// })();

app.post('/user/add', async (req, res) => {
    const userDetails = req.body;
    let { resCode, stringifiedResult } = await queryWrapper(INSERT.addUser, userDetails);
    res.statusCode = resCode;
    res.send(stringifiedResult);
});

app.post('/user/login', async (req, res) => {
    const userDetails = req.body;
    let { resCode, stringifiedResult } = await queryWrapper(SELECT.authenticateUser, userDetails);
    res.statusCode = resCode;
    res.send(stringifiedResult);
});



app.listen(port, () => {
    console.log(`The server is running on port ${port}`);
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