import { ExpressServer } from '../../../infra/server/server';
import mongoose from 'mongoose';
import request from 'supertest';
import { ClientModel } from '../../../infra/db/models/clientModel';

const app = new ExpressServer().create();

beforeEach((done) => {
  mongoose.connect('mongodb://127.0.0.1:27017/cosm-local', { useNewUrlParser: true, useUnifiedTopology: true }, () => done());
});

afterEach((done) => {
  mongoose.connection.close(() => done());
});

interface ClientReq {
  clientId?: string;
  name: string;
  birthDay: string | null;
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
  phone: '+48111111111',
  email: 'good@email.com',
  birthDay: null,
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
    expect(client.body.message).toContain(`Client need to have name but received: `);
    expect(client.status).toEqual(422);
  });

  it('Should not create client with wrong email structure /api/client/create', async () => {
    const testClientWrongEmail = mockClient();
    testClientWrongEmail.email = 'wrong#email.com';
    const client = await request(app).post('/api/client/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testClientWrongEmail);
    expect(client.body.message).toContain('Email structure is invalid: wrong#email.com');
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

    await ClientModel.deleteOne({ _id: createdClient.body.clientId });
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

    await ClientModel.deleteOne({ _id: createdClient.body.clientId });
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

    await ClientModel.deleteOne({ _id: createdClient.body.clientId });
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

    await ClientModel.deleteOne({ _id: createdClient.body.clientId });
  });

  it('Should not be able to update client without clientId property', async () => {
    const testClient = mockClient();

    const createdClient = await request(app).post('/api/client/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testClient);

    delete testClient['clientId'];

    const updatedClient = await request(app).patch('/api/client/update').auth(testUser.email, testUser.password, { type: 'basic' }).send(testClient);

    expect(updatedClient.body.message).toEqual('Missing property: clientId.');
    expect(updatedClient.status).toEqual(422);

    await ClientModel.deleteOne({ _id: createdClient.body.clientId });
  });

  it('Should not be able to update client with wrong email structure /api/client/update', async () => {
    const testClient = mockClient();
    const createdClient = await request(app).post('/api/client/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testClient);

    testClient.clientId = createdClient.body.clientId;
    testClient.email = 'wrong#email.com';

    const updatedClient = await request(app).patch('/api/client/update').auth(testUser.email, testUser.password, { type: 'basic' }).send(testClient);
    expect(updatedClient.body.message).toContain('Email structure is invalid: wrong#email.com');
    expect(updatedClient.status).toEqual(422);

    await ClientModel.deleteOne({ _id: createdClient.body.clientId });
  });

  it('Should not be able to update client with not existing clientId /api/client/update', async () => {
    const testClient = mockClient();

    testClient.clientId = 'some-random-id';

    const updatedClient = await request(app).patch('/api/client/update').auth(testUser.email, testUser.password, { type: 'basic' }).send(testClient);

    expect(updatedClient.body.message).toEqual('Client not found.');
    expect(updatedClient.status).toEqual(422);
  });
});

describe('Endpoint /api/client/:clientId', () => {
  it('Should GET client by clientId', async () => {
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

describe('Endpoint /api/client/all', () => {
  it('Should return clients list', async () => {
    const testClient = mockClient();

    const client1 = await request(app).post('/api/client/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testClient);
    const client2 = await request(app).post('/api/client/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testClient);

    const { body, status } = await request(app).get('/api/client/all?page=1&limit=2').auth(testUser.email, testUser.password, { type: 'basic' }).send();

    expect(status).toEqual(200);
    expect(body.count).toBeGreaterThan(1);
    expect(body.totalPages).toBeGreaterThanOrEqual(1);
    expect(body.currentPage).toEqual(1);
    expect(body.clients.length).toEqual(2);
    expect(body.clients).toBeInstanceOf(Array);

    await ClientModel.deleteOne({ _id: client1.body.clientId });
    await ClientModel.deleteOne({ _id: client2.body.clientId });
  });

  it('Should return filtered clients list', async () => {
    const testClient1 = mockClient();
    const testClient2 = mockClient();
    const testClient3 = mockClient();

    testClient1.name = 'FirstName123';
    testClient2.surname = 'SecondName456';
    testClient3.status = 'BANNED';

    const client1 = await request(app).post('/api/client/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testClient1);
    const client2 = await request(app).post('/api/client/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testClient2);
    const client3 = await request(app).post('/api/client/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testClient3);

    const result1 = await request(app).get(`/api/client/all?page=1&limit=2&client=firstname123`).auth(testUser.email, testUser.password, { type: 'basic' }).send();
    const result4 = await request(app).get(`/api/client/all?page=1&limit=2&client=123`).auth(testUser.email, testUser.password, { type: 'basic' }).send();
    const result2 = await request(app).get(`/api/client/all?page=1&limit=2&client=secondname456`).auth(testUser.email, testUser.password, { type: 'basic' }).send();
    const result5 = await request(app).get(`/api/client/all?page=1&limit=2&client=456`).auth(testUser.email, testUser.password, { type: 'basic' }).send();
    const result3 = await request(app).get(`/api/client/all?page=1&limit=2&status=banned`).auth(testUser.email, testUser.password, { type: 'basic' }).send();

    expect(result1.body.clients.every((client: { name: string }) => client.name.toLowerCase().includes(testClient1.name.toLowerCase()))).toEqual(true);
    expect(result4.body.clients.every((client: { name: string }) => client.name.toLowerCase().includes('123'))).toEqual(true);
    expect(result2.body.clients.every((client: { surname: string }) => client.surname.toLowerCase().includes('SecondName456'.toLowerCase()))).toEqual(true);
    expect(result5.body.clients.every((client: { surname: string }) => client.surname.toLowerCase().includes('456'))).toEqual(true);
    expect(result3.body.clients.every((client: { status: string }) => client.status === 'BANNED')).toEqual(true);

    await ClientModel.deleteOne({ _id: client1.body.clientId });
    await ClientModel.deleteOne({ _id: client2.body.clientId });
    await ClientModel.deleteOne({ _id: client3.body.clientId });
  });
});
describe('Endpoint /api/client/update/status', () => {
  it('Should change client status', async () => {
    const testClient = mockClient();

    const client = await request(app).post('/api/client/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testClient);

    const { body, status } = await request(app).patch('/api/client/update/status').auth(testUser.email, testUser.password, { type: 'basic' }).send({
      clientId: client.body.clientId,
      status: 'BANNED',
    });

    expect(status).toEqual(200);
    expect(body.message).toEqual('Client status updated.');
    expect(body.clientId).toEqual(client.body.clientId);
    expect(body.newStatus).toEqual('BANNED');
    expect(body.oldStatus).toEqual('ACTIVE');

    await ClientModel.deleteOne({ _id: client.body.clientId });
  });

  it('Should change client status', async () => {
    const testClient = mockClient();

    const client = await request(app).post('/api/client/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testClient);

    const { body, status } = await request(app).patch('/api/client/update/status').auth(testUser.email, testUser.password, { type: 'basic' }).send({
      clientId: client.body.clientId,
      status: 'BANNED',
    });

    expect(status).toEqual(200);
    expect(body.message).toEqual('Client status updated.');
    expect(body.clientId).toEqual(client.body.clientId);
    expect(body.newStatus).toEqual('BANNED');
    expect(body.oldStatus).toEqual('ACTIVE');

    await ClientModel.deleteOne({ _id: client.body.clientId });
  });

  it('Should not change client status when client does not exists', async () => {
    const { body, status } = await request(app).patch('/api/client/update/status').auth(testUser.email, testUser.password, { type: 'basic' }).send({
      clientId: 'asd',
      status: 'AVTICE',
    });

    expect(status).toEqual(422);
    expect(body.message).toEqual('Client not found.');
  });

  it('Should not change client status from other account', async () => {
    const testClient = mockClient();

    const client = await request(app).post('/api/client/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testClient);

    const { body, status } = await request(app).patch('/api/client/update/status').auth(testUser2.email, testUser2.password, { type: 'basic' }).send({
      clientId: client.body.clientId,
      status: 'BANNED',
    });

    expect(status).toEqual(422);
    expect(body.message).toEqual('Client not found.');

    await ClientModel.deleteOne({ _id: client.body.clientId });
  });

  it('Should not change client status to FAKESTATUS', async () => {
    const testClient = mockClient();

    const client = await request(app).post('/api/client/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testClient);

    const { body, status } = await request(app).patch('/api/client/update/status').auth(testUser.email, testUser.password, { type: 'basic' }).send({
      clientId: client.body.clientId,
      status: 'FAKESTATUS',
    });

    expect(status).toEqual(422);
    expect(body.message).toEqual('Invalid client status.');

    await ClientModel.deleteOne({ _id: client.body.clientId });
  });
});
