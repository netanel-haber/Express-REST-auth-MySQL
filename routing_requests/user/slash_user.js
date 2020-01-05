const express = require('express');
const userDbValidationMiddlewareFactory = require("../../input_validation/validationMiddlewareFactory");

const addUser = require('./add.js');
const changePassword = require('./change_password.js');
const updateUser = require('./update');
const login = require('./login.js');
const { extractToken, verifyToken } = require('../../utilities/jwt')


let addUserValidation = userDbValidationMiddlewareFactory("addUser");
let changePasswordValidation = userDbValidationMiddlewareFactory("changePassword");
let updateUserValidation = userDbValidationMiddlewareFactory("updateUser");
let loginValidation = userDbValidationMiddlewareFactory("login");


const router = express.Router();
//  path=/user/...
router
    .post('/add', addUserValidation, addUser)
    .post('/login', loginValidation, login)
    .post('/changePassword', changePasswordValidation, extractToken, verifyToken, changePassword)
    .post('/updateInfo', updateUserValidation, extractToken, verifyToken, updateUser)
    

module.exports = router;

