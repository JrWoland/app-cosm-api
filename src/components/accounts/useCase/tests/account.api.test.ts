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

describe('Test /account/login', () => {
  it('Should succesfully login to account', async () => {
    const res1 = await request(app).post('/api/account/register').send(testUser);
    const res2 = await request.agent(app).post('/api/account/login').send(testUser);

    expect(res2.status).toEqual(200);
    expect(res2.body.message).toEqual('Logged in successfully.');
    expect(res2.headers['set-cookie'][0]).toContain('access_token=');
  });

  it('Should not login to account when account does not exists', async () => {
    const res = await request(app).post('/api/account/login').send(notExistUser);
    expect(res.status).toEqual(422);
    expect(res.body.message).toEqual('Account does not exists.');
    expect(res.body.success).toBeFalsy();
  });

  it('Should not login to account when password is invalid', async () => {
    const res = await request(app).post('/api/account/login').send({ email: 'test@test.com', password: 'testtest2' });
    expect(res.status).toEqual(422);
    expect(res.body.message).toEqual('Password or email is invalid.');
    expect(res.body.success).toBeFalsy();
  });
});

describe('Test /account/register', () => {
  it('Should successfully register new Account', async () => {
    const res = await request(app).post('/api/account/register').send(registerUser);

    expect(res.status).toEqual(201);
    expect(res.body.message).toEqual('Account created.');

    //check if exists in database
    const newAccount = await AccountModel.findOne({ email: registerUser.email });
    expect(newAccount?.email).toEqual(registerUser.email);

    // and delete account
    await AccountModel.deleteOne({ email: registerUser.email });
  });

  it('Should not register new Account when email is already taken', async () => {
    const TEST_TAKEN_EMAIL = 'testtaken@testtaken.com';
    const res = await request(app).post('/api/account/register').send({ email: TEST_TAKEN_EMAIL, password: 'testtest' });

    // try to create the account if its already exists
    const res2 = await request(app).post('/api/account/register').send({ email: TEST_TAKEN_EMAIL, password: 'testtest' });

    expect(res2.status).toEqual(422);
    expect(res2.body.message).toEqual('Account already exists.');

    // and delete account
    await AccountModel.deleteOne({ email: TEST_TAKEN_EMAIL });
  });

  it('Should not register new Account when password is less than 8 chars', async () => {
    const EMAIL = 'chars@chars.com';
    const res = await request(app).post('/api/account/register').send({ email: EMAIL, password: '123' });

    expect(res.status).toEqual(422);
    expect(res.body.message).toEqual('Password does not meet criteria, min 8 chars.');

    // and delete account
    await AccountModel.deleteOne({ email: EMAIL });
  });
});

// TODO
// it('Delete account /account/register', async () => {
//   const resRegister = await request(app).post('/account/register').send(deleteUser);
//   const resLogin = await request(app).post('/account/login').send(deleteUser);

//   const resDelete = await request(app).delete('/account/').set('Authorization', `Bearer ${resLogin.body.token}`).send();

//   expect(resDelete.status).toEqual(200);
//   expect(resDelete.body.message).toEqual('Account deleted.');
// });
