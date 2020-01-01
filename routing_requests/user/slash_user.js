const addUser = require('./add.js');
const changePassword = require('./change_password.js');
const updateUser = require('./update');
const login = require('./login.js');
const express = require('express');
const { extractToken, verifyToken } = require('../../utilities/jwt')
const validationMiddlewareFactory = require("../../input_validation/users_db/validationMiddlewareFactory");

let addUserValidation = validationMiddlewareFactory("addUser");
let changePasswordValidation = validationMiddlewareFactory("changePassword");
let updateUserValidation = validationMiddlewareFactory("updateUser");
let loginValidation = validationMiddlewareFactory("login");


const router = express.Router();
router
    .post('/add', addUserValidation, addUser)
    .post('/changePassword', changePasswordValidation, extractToken, verifyToken, changePassword)
    .post('/updateInfo', updateUserValidation, extractToken, verifyToken, updateUser)
    .post('/login', loginValidation, login);

module.exports = router;

