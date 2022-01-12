"use strict";
var express = require('express');
var ClientsController = require('./ClientsController');
var checkAuth = require('../../auth/check-auth');
var router = express.Router();
router.use(function (req, res, next) {
    req.account = 'verified';
    next();
});
router.get('/', checkAuth, ClientsController.getClientsList);
router.get('/:clientId', checkAuth, ClientsController.getClient);
router.post('/', checkAuth, ClientsController.addClient);
router.patch('/:clientId', checkAuth, ClientsController.updateClient);
router.delete('/:clientId', checkAuth, ClientsController.removeClient);
module.exports = router;
