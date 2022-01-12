"use strict";
var express = require('express');
var UsersController = require('../controllers/UsersController');
var router = express.Router();
router.post('/signup', UsersController.createUser);
router.post('/login', UsersController.loginUser);
router.delete('/delete/:userId', UsersController.deleteUser);
module.exports = router;
