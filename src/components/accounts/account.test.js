// jest.useRealTimers();
const ExpressServer = require('../../infra/server/server');
const mongoose = require('mongoose');
const request = require('supertest');
const AccountsModel = require('./AccountsModel');

const app = new ExpressServer().create();

beforeEach((done) => {
  mongoose.connect(
    'mongodb://localhost:27017/cosm-local',
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => done(),
  );
});

afterEach((done) => {
  mongoose.connection.close(() => done());
});

const notExistUser = { email: 'fake@fake.com', password: 'fake' };
const testUser = { email: 'test@test.com', password: 'test' };
const registerUser = { email: 'register@register.com', password: 'register' };
const deleteUser = { email: 'delete@delete.com', password: 'delete' };

it('Return not auth error from /account', async () => {
  const res = await request(app).get('/account');
  expect(res.status).toEqual(401);
  expect(res.body.message).toEqual('Auth failed. Login first.');
  expect(res.body.success).toBeFalsy();
});

it('Not exists user /account/login', async () => {
  //donst use done(), some error can appear
  const res = await request(app).post('/account/login').send(notExistUser);
  expect(res.status).toEqual(401);
  expect(res.body.message).toEqual('Auth failed.');
  expect(res.body.success).toBeFalsy();
});

it('Success logged user /account/login', async () => {
  const res = await request(app).post('/account/login').send(testUser);
  expect(res.status).toEqual(200);
  expect(res.body.message).toEqual('Auth succesfull');
  expect(res.body.success).toBeTruthy();
  expect(res.body.token).toBeTruthy();
});

it('Success logged user /account/register', async () => {
  const res = await request(app).post('/account/register').send(testUser);
  expect(res.status).toEqual(422);
  expect(res.body.message).toEqual('Email adress already exists.');
  expect(res.body.success).toBeFalsy();
});

it('Success Register new Account /account/register', async () => {
  const res = await request(app).post('/account/register').send(registerUser);

  expect(res.status).toEqual(201);
  expect(res.body.message).toEqual('Account created.');
  expect(res.body.success).toBeTruthy();
  expect(res.body.email).toEqual(registerUser.email);

  //check if exists in database
  const newAccount = await AccountsModel.findOne({ email: registerUser.email });

  expect(newAccount.services[0].name).toEqual('LASHES');
  expect(newAccount.services[0].expires).toEqual(new Date(2100, 1, 1));

  // and delete account
  await AccountsModel.deleteOne({ email: registerUser.email });
});

it('Success  new Account /account/register', async () => {
  const res = await request(app).post('/account/register').send(registerUser);

  expect(res.status).toEqual(201);
  expect(res.body.message).toEqual('Account created.');
  expect(res.body.success).toBeTruthy();
  expect(res.body.email).toEqual(registerUser.email);

  //check if exists in database
  const newAccount = await AccountsModel.findOne({ email: registerUser.email });

  expect(newAccount.services[0].name).toEqual('LASHES');
  expect(newAccount.services[0].expires).toEqual(new Date(2100, 1, 1));

  // and delete account
  await AccountsModel.deleteOne({ email: registerUser.email });
});

it('Delete account /account/register', async () => {
  const resRegister = await request(app)
    .post('/account/register')
    .send(deleteUser);
  const resLogin = await request(app).post('/account/login').send(deleteUser);

  //need to have bearer token
  const resDelete = await request(app)
    .delete('/account/')
    .set('Authorization', `Bearer ${resLogin.body.token}`)
    .send();

  expect(res.status).toEqual(200);
  expect(res.body.message).toEqual('Account deleted.');
  expect(res.body.success).toBeTruthy();
});
