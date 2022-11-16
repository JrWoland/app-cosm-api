import { ExpressServer } from '../../../../infra/server/server';
import mongoose from 'mongoose';
import request from 'supertest';
import { AccountModel } from '../../../../infra/db/models/accountModel';
import cookieParser from 'cookie-parser';

const app = new ExpressServer().create();

app.use(cookieParser());

beforeEach((done) => {
  mongoose.connect('mongodb://localhost:27017/cosm-local', { useNewUrlParser: true, useUnifiedTopology: true }, () => done());
});

afterEach((done) => {
  mongoose.connection.close(() => done());
});

const notExistUser = { email: 'fake@fake.com', password: 'fakefake' };
const testUser = { email: 'test@test.com', password: 'testtest' };
const registerUser = { email: 'register@register.com', password: 'registerregister' };
const deleteUser = { email: 'delete@delete.com', password: 'deletedelete' };

it('Not exists user /account/login', async () => {
  //dont use done(), some error can appear
  const res = await request(app).post('/api/account/login').send(notExistUser);
  expect(res.status).toEqual(422);
  expect(res.body.message).toEqual('Account does not exists.');
  expect(res.body.success).toBeFalsy();
});

it('Success Register new Account /account/register', async () => {
  const res = await request(app).post('/api/account/register').send(registerUser);

  expect(res.status).toEqual(201);
  expect(res.body.message).toEqual('Account created.');

  //check if exists in database
  const newAccount = await AccountModel.findOne({ email: registerUser.email });
  expect(newAccount?.email).toEqual(registerUser.email);

  // and delete account
  await AccountModel.deleteOne({ email: registerUser.email });
});

it('Success logged user /account/login', async () => {
  const res1 = await request(app).post('/api/account/register').send(testUser);
  const res2 = await request.agent(app).post('/api/account/login').send(testUser);

  expect(res2.status).toEqual(200);
  expect(res2.body.message).toEqual('Logged in successfully.');
  expect(res2.headers['set-cookie'][0]).toContain('access_token=');
});

// TODO
// it('Delete account /account/register', async () => {
//   const resRegister = await request(app).post('/account/register').send(deleteUser);
//   const resLogin = await request(app).post('/account/login').send(deleteUser);

//   const resDelete = await request(app).delete('/account/').set('Authorization', `Bearer ${resLogin.body.token}`).send();

//   expect(resDelete.status).toEqual(200);
//   expect(resDelete.body.message).toEqual('Account deleted.');
// });
