"use strict";
var mongsoose = require('mongoose');
var Order = require('../models/ordersModel');
var Product = require('../models/productsModel');
var OrdersController = /** @class */ (function () {
    function OrdersController() {
    }
    OrdersController.prototype.getAllOrders = function (req, res, next) {
        Order.find()
            .select('product quantity _id')
            .populate('product', 'name price')
            .exec()
            .then(function (docs) {
            var response = {
                count: docs.length,
                order: docs.map(function (doc) { return ({
                    id: doc._id,
                    product: doc,
                    quantity: doc
                }); })
            };
            res.status(200).json(response);
        })
            .catch(function (err) { return res.status(500).json({ error: err }); });
    };
    OrdersController.prototype.createOrder = function (req, res, next) {
        Product.findById(req.body.productId)
            .then(function (product) {
            if (!product) {
                return res.status(500).json({
                    message: 'Product does not exist'
                });
            }
            var order = new Order({
                _id: mongsoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: product
            });
            return order.save();
        })
            .then(function (result) {
            res.status(201).json({
                message: 'Order stored',
                createdOrder: {
                    id: result._id,
                    product: result.product,
                    quantity: result.quantity
                }
            });
        })
            .catch(function (err) {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    };
    OrdersController.prototype.getOrderById = function (req, res, next) {
        Order.findById(req.params.orderId)
            .populate('product', 'name price')
            .exec()
            .then(function (order) {
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            res.status(200).json({
                order: order
            });
        })
            .catch(function (err) { return res.status(500).json({ error: err }); });
    };
    OrdersController.prototype.deleteOrder = function (req, res, next) {
        Order.remove({ _id: req.params.orderId })
            .exec()
            .then(function (result) {
            return res.status(200).json({
                message: "Order deleted ".concat(req.params.orderId)
            });
        })
            .catch(function (err) { return res.status(500).json({ error: err }); });
    };
    return OrdersController;
}());
module.exports = new OrdersController();
