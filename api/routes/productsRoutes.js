const express = require('express');

const router = express.Router();

const mongsoose = require('mongoose');

const ProductsController = require('../controllers/ProductsController');

const checkAuth = require('../auth/check-auth');

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

router.get('/', ProductsController.getAllProducts);

router.get('/:productId', ProductsController.getProductById);

router.patch('/:productId', checkAuth, ProductsController.updateProduct);

router.delete('/:productId', checkAuth, ProductsController.deleteProduct);

module.exports = router;
