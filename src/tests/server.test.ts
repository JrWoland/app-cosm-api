// const ExpressServer = require('../infra/server/server');
import { ExpressServer } from '../infra/server/server';
import request from 'supertest';

const fakeSeverVersion = '1.0.0-localhost';

const app = new ExpressServer().create(fakeSeverVersion);

it('Return app version from GET /', async () => {
  const res = await request(app).get('/');
  expect(res.status).toEqual(200);
  expect(res.body).toHaveProperty('version', fakeSeverVersion);
  expect(res.body).toBeInstanceOf(Object);
});

it('Return Error from /fake-route', async () => {
  const res = await request(app).get('/fake-route');
  expect(res.status).toEqual(404);
  expect(res.body.message).toEqual('Could not found a proper route');
});
