const ExpressServer = require('../infra/server/server');

const app = new ExpressServer().create();

const request = require('supertest');

it('Return app version from GET /', async () => {
  const res = await request(app).get('/');
  expect(res.status).toEqual(200);
  expect(res.body).toEqual({ version: require('../package.json').version });
});

it('Return Error from /fake-route', async () => {
  const res = await request(app).get('/fake-route');
  expect(res.status).toEqual(404);
  expect(res.body.message).toEqual('Could not found a proper route');
});
