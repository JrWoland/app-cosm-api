const express = require('express');
const AccountsController = require('../controllers/AccountsController')
const checkAuth = require('../auth/check-auth');

const router = express.Router();

router.get('/', checkAuth, AccountsController.getAccount);

router.get('/clients', checkAuth, AccountsController.getClientsList);

router.get('/client/:clientId', checkAuth, AccountsController.getClient);

router.post('/client', checkAuth, AccountsController.addClient);

router.patch('/client/:clientId', checkAuth, AccountsController.updateClient);

router.delete('/client/:clientId', checkAuth, AccountsController.removeClient);

module.exports = router;