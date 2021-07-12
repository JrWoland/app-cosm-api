
const app = require('../server')

const request = require('supertest');

it('Return app version from GET /', async () => {
  const res =  await request(app).get('/')
  expect(res.status).toEqual(200)
  expect(res.body).toEqual({version: require('../package.json').version})
})

it('Return Error from /asd', async () => {
  const res =  await request(app).get('/asd')
  expect(res.status).toEqual(404)
  expect(res.body.message).toEqual('Could not found a proper route')
})

it('Return not auth error from /account', async () => {
  const res =  await request(app).get('/account')
  expect(res.status).toEqual(401)
  expect(res.body.message).toEqual('Auth failed. Login first.')
})