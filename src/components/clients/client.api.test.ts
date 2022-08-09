import { ExpressServer } from '../../infra/server/server';
import mongoose from 'mongoose';
import request from 'supertest';
import { ClientModel } from '../../infra/db/models/clientModel';

const app = new ExpressServer().create();

beforeEach((done) => {
  mongoose.connect('mongodb://localhost:27017/cosm-local', { useNewUrlParser: true, useUnifiedTopology: true }, () => done());
});

afterEach((done) => {
  mongoose.connection.close(() => done());
});

const testUser = { email: 'test@test.com', password: 'testtest' };
const testUser2 = { email: 'test2@test2.com', password: 'testtest2' };

it('Should create client /api/client/create', async () => {
  const testClient = {
    name: 'Prosto',
    surname: 'Prosto surname',
    phone: '123123123',
  };
  const client = await request(app).post('/api/client/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testClient);
  expect(client.status).toEqual(201);
  expect(client.body.message).toEqual('Client created.');
  expect(client.body.clientId).toBeTruthy();

  const result = await ClientModel.exists({ _id: client.body.clientId });
  expect(result).toEqual(true);

  await ClientModel.deleteOne({ _id: client.body.clientId });
});

it('Should not create client without name /api/client/create', async () => {
  const testClientNoName = {
    name: '',
    surname: 'Prosto surname',
    phone: '123123123',
  };
  const client = await request(app).post('/api/client/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testClientNoName);
  expect(client.status).toEqual(422);
  expect(client.body.message).toEqual('Client need to have name.');
});

it('Should not create client with wrong email structure /api/client/create', async () => {
  const testClientWrongEmail = {
    name: 'Prosto',
    surname: 'Prosto surname',
    phone: '123123123',
    email: 'fake#email.com',
  };
  const client = await request(app).post('/api/client/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testClientWrongEmail);
  expect(client.status).toEqual(422);
  expect(client.body.message).toEqual('Email structure is invalid.');
});
