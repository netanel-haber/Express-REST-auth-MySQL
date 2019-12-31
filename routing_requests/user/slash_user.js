import addUser from './add';
import changePassword from './change_password';
import updateUser from './update';
import login from './login';
import express from 'express';
import validationMiddlewareFactory from "../../input_validation/users_db/validationMiddlewareFactory";

addUserValidation = validationMiddlewareFactory("addUser");
changePasswordValidation = validationMiddlewareFactory("changePassword");
updateUserValidation = validationMiddlewareFactory("updateUser");
loginValidation = validationMiddlewareFactory("login");


const router = express.Router();
router
    .post('/add', addUserValidation, addUser)
    .post('/changePassword', changePasswordValidation, extractToken, verifyToken, changePassword)
    .post('/updateInfo', updateUserValidation, extractToken, verifyToken, updateUser)
    .post('/login', loginValidation, login);

export default router;

