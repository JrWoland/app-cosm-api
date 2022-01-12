"use strict";
var express = require('express');
var router = express.Router();
var mongsoose = require('mongoose');
var multer = require('multer');
var ProductsController = require('../controllers/ProductsController');
var checkAuth = require('../auth/check-auth');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/images');
    },
    filename: function (req, file, cb) {
        var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, "".concat(uniqueSuffix, " ").concat(file.originalname));
    }
});
var fileFilter = function (req, file, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
var upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fieldSize: 1024 * 1024
    }
});
router.get('/', ProductsController.getAllProducts);
router.get('/:productId', ProductsController.getProductById);
router.post('/', checkAuth, upload.single('productImage'), ProductsController.createdProduct);
router.patch('/:productId', checkAuth, ProductsController.updateProduct);
router.delete('/:productId', checkAuth, ProductsController.deleteProduct);
module.exports = router;
