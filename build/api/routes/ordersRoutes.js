"use strict";
var express = require('express');
var router = express.Router();
var OrderControllers = require('../controllers/OrdersController');
var checkAuth = require('../auth/check-auth');
router.get('/', checkAuth, OrderControllers.getAllOrders);
router.get('/:orderId', checkAuth, OrderControllers.getOrderById);
router.post('/', checkAuth, OrderControllers.createOrder);
router.delete('/:orderId', checkAuth, OrderControllers.deleteOrder);
module.exports = router;