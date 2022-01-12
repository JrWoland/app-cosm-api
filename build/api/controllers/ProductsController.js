"use strict";
var mongsoose = require('mongoose');
var Product = require('../models/productsModel');
var ProductsController = /** @class */ (function () {
    function ProductsController() {
    }
    ProductsController.prototype.getAllProducts = function (req, res, next) {
        Product.find()
            .select('name price _id productImage')
            .exec()
            .then(function (docs) {
            var response = {
                count: docs.length,
                products: docs.map(function (doc) { return ({
                    _id: doc._id,
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                }); }),
            };
            res.status(200).json(response);
        })
            .catch(function (err) {
            res.status(500).json({ error: err });
        });
    };
    ProductsController.prototype.createdProduct = function (req, res, next) {
        var product = new Product({
            _id: new mongsoose.Types.ObjectId(),
            name: req.body.name,
            price: req.body.price,
            productImage: req.file.path,
        });
        product
            .save()
            .then(function (result) {
            res.status(201).json({
                message: 'Product created',
                createdProduct: {
                    _id: result._id,
                    name: result.name,
                    price: result.price,
                    productImage: result.productImage,
                },
            });
        })
            .catch(function (err) {
            res.status(500).json({ error: err });
        });
    };
    ProductsController.prototype.getProductById = function (req, res, next) {
        var id = req.params.productId;
        Product.findById(id)
            .select('name price _id productImage')
            .select('name price _id productImage')
            .exec()
            .then(function (doc) {
            if (doc !== null) {
                res.status(200).json(doc);
            }
            else {
                res.status(404).json({ message: 'Entity does not exist' });
            }
        })
            .catch(function (err) {
            res.status(500).json({ error: err });
        });
    };
    ProductsController.prototype.updateProduct = function (req, res, next) {
        var id = req.params.productId;
        var update = {};
        for (var _i = 0, _a = req.body; _i < _a.length; _i++) {
            var property = _a[_i];
            update[property.propName] = property.value;
        }
        Product.update({ _id: id }, { $set: update })
            .exec()
            .then(function (result) {
            res.status(200).json({
                message: "Updated ".concat(id),
                databaseDetailsResult: result,
            });
        })
            .catch(function (err) {
            res.status(500).json({ error: err });
        });
    };
    ProductsController.prototype.deleteProduct = function (req, res, next) {
        var id = req.params.productId;
        Product.remove({ _id: id })
            .exec()
            .then(function (result) {
            res.status(200).json({
                message: "Deleted ".concat(id),
                databaseDetailsResult: result,
            });
        })
            .catch(function (err) {
            res.status(500).json({ error: err });
        });
    };
    return ProductsController;
}());
module.exports = new ProductsController();
