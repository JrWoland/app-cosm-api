const express = require('express');
const UsersController = require('./UsersController')

const router = express.Router();

router.post('/signup', UsersController.createUser);

router.post('/login', UsersController.loginUser);

router.delete('/delete/:userId', UsersController.deleteUser);

module.exports = router;
