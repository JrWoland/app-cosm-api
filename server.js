const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');
const serverHeaders = require('./api/settings/serverHeaders')
const MongoDatabase = require('./api/db/mongo')

MongoDatabase.initConnection()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(serverHeaders);

app.use('/uploads/images', express.static('uploads/images'));
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

app.get('/', (req, res) => res.status(200).json({ version: require('./package.json').version }));

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: 'Could not found a proper route',
    error: err
  });
});

module.exports = app;
