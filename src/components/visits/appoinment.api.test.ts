import { ExpressServer } from '../../infra/server/server';
import mongoose from 'mongoose';
import request from 'supertest';
import { AppointmentModel } from '../../infra/db/models/appointmentModel';

const app = new ExpressServer().create();

beforeEach((done) => {
  mongoose.connect('mongodb://localhost:27017/cosm-local', { useNewUrlParser: true, useUnifiedTopology: true }, () => done());
});

afterEach((done) => {
  mongoose.connection.close(() => done());
});

const getCookie = (cookie: string) => {
  return Object.fromEntries(cookie.split(';').map((i: string) => i.trim().split('=')));
};

const testUser = { email: 'test@test.com', password: 'testtest' };
const appoinment = {
  clientId: null,
  date: '2022-05-03T15:53:43.202Z',
  startTime: 500,
  duration: 800,
  treatments: [],
};

it('Create appointment /appointment/create', async () => {
  //dont use done(), some error can appear
  const logged = await request(app).post('/api/account/login').send(testUser);
  const cookie = logged.headers['set-cookie'][0];
  const { access_token } = getCookie(cookie);
  const appointment = await request(app)
    .post('/api/appointment/create')
    .set('Cookie', [`access_token=${access_token}`])
    .send(appoinment);
  expect(appointment.status).toEqual(201);
  expect(appointment.body.message).toEqual('Appointment created.');
});

it('Remove appoinment /appointment', async () => {
  //dont use done(), some error can appear
  // const logged = await request(app).post('/api/account/login').send(testUser);
  // const appointment = await request(app).post('/api/appointment').send({});
  // expect(appointment.status).toEqual(201);
  // expect(appointment.body.message).toEqual('Appointment created.');
});

it('Update appoinment /appointment', async () => {
  //dont use done(), some error can appear
  // const logged = await request(app).post('/api/account/login').send(testUser);
  // const appointment = await request(app).post('/api/appointment').send({});
  // expect(appointment.status).toEqual(201);
  // expect(appointment.body.message).toEqual('Appointment created.');
});
