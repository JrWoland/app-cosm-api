const VisitsController = require('./VisitsController')
const checkAuth = require('../../api/auth/check-auth');
const express = require('express');

const router = express.Router();

router.get('/', checkAuth, VisitsController.getVisitList);

router.get('/:visitId', checkAuth, VisitsController.getVisit);

router.post('/', checkAuth, VisitsController.addVisit);

router.patch('/:visitId', checkAuth, VisitsController.updateVisit);

router.delete('/:visitId', checkAuth, VisitsController.removeVisit);

module.exports = router;