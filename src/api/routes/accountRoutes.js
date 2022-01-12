const express = require('express');
const AccountsController = require('../controllers/AccountsController')
const VisitsController = require('../controllers/VisitsController')
const checkAuth = require('../auth/check-auth');

const router = express.Router();

router.get('/', checkAuth, AccountsController.getAccount);

router.get('/clients', checkAuth, AccountsController.getClientsList);

router.get('/client/:clientId', checkAuth, AccountsController.getClient);

router.post('/client', checkAuth, AccountsController.addClient);

router.patch('/client/:clientId', checkAuth, AccountsController.updateClient);

router.delete('/client/:clientId', checkAuth, AccountsController.removeClient);


router.get('/client/:clientId/visits', checkAuth, VisitsController.getVisitList);

router.get('/client/:clientId/visit/:visitId', checkAuth, VisitsController.getVisit);

router.post('/client/:clientId/visit', checkAuth, VisitsController.addVisit);

router.patch('/client/:clientId/visit/:visitId', checkAuth, VisitsController.updateVisit);

router.delete('/client/:clientId/visit/:visitId', checkAuth, VisitsController.removeVisit);

module.exports = router;