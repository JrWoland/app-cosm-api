const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const serverHeaders = require('./api/settings/serverHeaders')

const productRoutes = require('./api/routes/productsRoutes');
const orderRoutes = require('./api/routes/ordersRoutes');
const userRoutes = require('./api/routes/userRoutes');
const accountRoutes = require('./api/routes/accountRoutes');

const MongoDatabase = require('./api/db/mongo')
MongoDatabase.initConnection()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(serverHeaders);
app.use(morgan('dev'))

app.get('/', (req, res) => res.status(200).json({ version: require('./package.json').version }));
app.use('/uploads/images', express.static('uploads/images'));
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);
app.use('/account', accountRoutes);

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
