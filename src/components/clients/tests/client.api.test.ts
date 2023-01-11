import { ExpressServer } from '../../../infra/server/server';
import mongoose from 'mongoose';
import request from 'supertest';
import { ClientModel } from '../../../infra/db/models/clientModel';

const app = new ExpressServer().create();

beforeEach((done) => {
  mongoose.connect('mongodb://localhost:27017/cosm-local', { useNewUrlParser: true, useUnifiedTopology: true }, () => done());
});

afterEach((done) => {
  mongoose.connection.close(() => done());
});

interface ClientReq {
  clientId?: string;
  name: string;
  surname?: string;
  phone?: string;
  status?: string;
  email?: string;
}
const names = ['Alice', 'Lucy', 'Ginger', 'Ann', 'Pony', 'Eli', 'Panam', 'Vi', 'Fast', 'Inna', 'Tina'];
const surnames = ['Blue', 'Green', 'Red', 'Orange', 'Potato', 'Tomato', 'Cyan', 'Yellow', 'Pink', 'Grey'];
const mockClient = (): ClientReq => ({
  name: names[Math.floor(Math.random() * names.length)],
  surname: surnames[Math.floor(Math.random() * surnames.length)],
  phone: '123123123',
  email: 'good@email.com',
});

const testUser = { email: 'test@test.com', password: 'testtest' };
const testUser2 = { email: 'test2@test2.com', password: 'testtest2' };

describe('Endpoint /api/client/create', () => {
  it('Should create client /api/client/create', async () => {
    const testClient = mockClient();
    const client = await request(app).post('/api/client/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testClient);
    expect(client.body.message).toEqual('Client created.');
    expect(client.body.clientId).toBeTruthy();
    expect(client.status).toEqual(201);

    const result = await ClientModel.exists({ _id: client.body.clientId });
    expect(result).toEqual(true);

    await ClientModel.deleteOne({ _id: client.body.clientId });
  });

  it('Should not create client without name /api/client/create', async () => {
    const testClientNoName = mockClient();
    testClientNoName.name = '';
    const client = await request(app).post('/api/client/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testClientNoName);
    expect(client.body.message).toEqual('Client need to have name.');
    expect(client.status).toEqual(422);
  });

  it('Should not create client with wrong email structure /api/client/create', async () => {
    const testClientWrongEmail = mockClient();
    testClientWrongEmail.email = 'wrong#email.com';
    const client = await request(app).post('/api/client/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testClientWrongEmail);
    expect(client.body.message).toEqual('Email structure is invalid.');
    expect(client.status).toEqual(422);
  });
});

describe('Endpoint /api/client/update', () => {
  it('Should update client', async () => {
    const testClient = mockClient();
    const createdClient = await request(app).post('/api/client/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testClient);
    expect(createdClient.status).toEqual(201);
    expect(createdClient.body.message).toEqual('Client created.');

    testClient.clientId = createdClient.body.clientId;
    testClient.name = 'Fas';
    testClient.surname = 'Bar';
    testClient.email = 'new@email.com';

    const updatedClient = await request(app).patch('/api/client/update').auth(testUser.email, testUser.password, { type: 'basic' }).send(testClient);

    expect(updatedClient.body.message).toEqual('Client updated.');
    expect(updatedClient.status).toEqual(200);
    expect(updatedClient.body.clientId).toEqual(createdClient.body.clientId);
  });

  it('Should update client status', async () => {
    const testClient = mockClient();
    const createdClient = await request(app).post('/api/client/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testClient);
    expect(createdClient.body.message).toEqual('Client created.');
    expect(createdClient.status).toEqual(201);

    testClient.clientId = createdClient.body.clientId;
    testClient.status = 'BANNED';

    const updatedClient = await request(app).patch('/api/client/update/status').auth(testUser.email, testUser.password, { type: 'basic' }).send(testClient);

    expect(updatedClient.body.message).toEqual('Client status updated.');
    expect(updatedClient.body.clientId).toEqual(createdClient.body.clientId);
    expect(updatedClient.body.newStatus).toEqual('BANNED');
    expect(updatedClient.status).toEqual(200);
  });

  it('Should not update client status', async () => {
    const testClient = mockClient();
    const createdClient = await request(app).post('/api/client/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testClient);
    expect(createdClient.status).toEqual(201);
    expect(createdClient.body.message).toEqual('Client created.');

    testClient.clientId = createdClient.body.clientId;
    testClient.status = 'FAKE_STATUS';

    const updatedClient = await request(app).patch('/api/client/update/status').auth(testUser.email, testUser.password, { type: 'basic' }).send(testClient);

    expect(updatedClient.body.message).toEqual('Invalid client status.');
    expect(updatedClient.status).toEqual(422);
  });

  it('Should not be able to update client from another account', async () => {
    const testClient = mockClient();

    // client created within account 1
    const createdClient = await request(app).post('/api/client/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testClient);

    testClient.clientId = createdClient.body.clientId;

    // try access from account 2
    const updatedClient = await request(app).patch('/api/client/update').auth(testUser2.email, testUser2.password, { type: 'basic' }).send(testClient);

    expect(updatedClient.body.message).toEqual('Client not found.');
    expect(updatedClient.status).toEqual(422);
  });

  it('Should not be able to update client without clientId property', async () => {
    const testClient = mockClient();
    await request(app).post('/api/client/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testClient);

    delete testClient['clientId'];

    const updatedClient = await request(app).patch('/api/client/update').auth(testUser.email, testUser.password, { type: 'basic' }).send(testClient);

    expect(updatedClient.body.message).toEqual('Missing property: clientId.');
    expect(updatedClient.status).toEqual(422);
  });

  it('Should not be able to update client with wrong email structure /api/client/update', async () => {
    const testClient = mockClient();
    const createdClient = await request(app).post('/api/client/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testClient);

    testClient.clientId = createdClient.body.clientId;
    testClient.email = 'wrong#email.com';

    const updatedClient = await request(app).patch('/api/client/update').auth(testUser.email, testUser.password, { type: 'basic' }).send(testClient);
    expect(updatedClient.body.message).toEqual('Email structure is invalid.');
    expect(updatedClient.status).toEqual(422);
  });

  it('Should not be able to update client with not existing clientId /api/client/update', async () => {
    const testClient = mockClient();

    await request(app).post('/api/client/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testClient);

    testClient.clientId = 'some-random-id';

    const updatedClient = await request(app).patch('/api/client/update').auth(testUser.email, testUser.password, { type: 'basic' }).send(testClient);

    expect(updatedClient.body.message).toEqual('Client not found.');
    expect(updatedClient.status).toEqual(422);
  });
});

describe('Endpoint /api/client/:clientId', () => {
  it('Should GET client by clientId ', async () => {
    const testClient = mockClient();

    const client = await request(app).post('/api/client/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testClient);

    const clientGET = await request(app).get(`/api/client/${client.body.clientId}`).auth(testUser.email, testUser.password, { type: 'basic' }).send(testClient);

    expect(clientGET.body.id).toEqual(client.body.clientId);
    expect(clientGET.body.name).toEqual(testClient.name);
    expect(clientGET.body.surname).toEqual(testClient.surname);
    expect(clientGET.body.birthDate).toEqual(null);
    expect(clientGET.body.phone).toEqual(testClient.phone);
    expect(clientGET.body.email).toEqual(testClient.email);

    await ClientModel.deleteOne({ _id: client.body.clientId });
  });
  it('Should not be able to GET client by clientId from other account', async () => {
    const testClient = mockClient();

    // auth account2
    const client = await request(app).post('/api/client/create').auth(testUser2.email, testUser2.password, { type: 'basic' }).send(testClient);

    // auth account1
    const clientGET = await request(app).get(`/api/client/${client.body.clientId}`).auth(testUser.email, testUser.password, { type: 'basic' });

    expect(clientGET.body.message).toEqual('Cant find client by id: Client does not exists.');
    expect(clientGET.status).toEqual(404);

    await ClientModel.deleteOne({ _id: client.body.clientId });
  });
});
