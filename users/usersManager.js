const usersStorage = require('./users.js');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'testnodey.chitjct3ipsw.us-east-2.rds.amazonaws.com',
    user: 'admin',
    password: '1sIXmZQQDVVqsHBhdBM4',
    database: 'testing_for_node'
});

module.exports = {
    getUserById: (id) => {
        return new Promise((resolve, reject) => {
            connection.connect();
            connection.query(`SELECT * from users where id=${id}`, function (error, results, fields) {
                connection.end();
                if (error) reject(error);
                resolve(results[0]);

            });
        });
    },
    addUser: async ({
        first_name,
        last_name,
        gender,
        age
    }) => {
        return new Promise((resolve, reject) => {
            connection.connect();
            connection.query(`INSERT INTO users (first_name, last_name, gender, age)
                                VALUES ('${first_name}', '${last_name}', ${gender}, ${age});`, function (error, results, fields) {
                connection.end();
                if (error) reject(error);
                console.log(results);

                resolve({
                    data:`the ${first_name} is add succesfully`,
                    error:null
                });

            });

        })
    }
}