const express = require('express');
const ClientsController = require('./ClientsController')
const checkAuth = require('../../api/auth/check-auth');

const router = express.Router();

router.use((req, res, next) => {
    req.account = 'verified'
    next()
})

router.get('/', checkAuth, ClientsController.getClientsList);

router.get('/:clientId', checkAuth, ClientsController.getClient);

router.post('/', checkAuth, ClientsController.addClient);

router.patch('/:clientId', checkAuth, ClientsController.updateClient);

router.delete('/:clientId', checkAuth, ClientsController.removeClient);

module.exports = router;
