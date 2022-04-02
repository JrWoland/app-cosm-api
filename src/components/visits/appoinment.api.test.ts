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
const testUser = { email: 'test@test.com', password: 'testtest' };

it('Create appoinment /appointment', async () => {
  //dont use done(), some error can appear
  // const logged = await request(app).post('/api/account/login').send(testUser);
  // const appointment = await request(app).post('/api/appointment').send({});
  // expect(appointment.status).toEqual(201);
  // expect(appointment.body.message).toEqual('Appointment created.');
  // expect(appointment.body.success).toBeTruthy();
});

it('Remove appoinment /appointment', async () => {
  //dont use done(), some error can appear
  // const logged = await request(app).post('/api/account/login').send(testUser);
  // const appointment = await request(app).post('/api/appointment').send({});
  // expect(appointment.status).toEqual(201);
  // expect(appointment.body.message).toEqual('Appointment created.');
  // expect(appointment.body.success).toBeTruthy();
});

it('Update appoinment /appointment', async () => {
  //dont use done(), some error can appear
  // const logged = await request(app).post('/api/account/login').send(testUser);
  // const appointment = await request(app).post('/api/appointment').send({});
  // expect(appointment.status).toEqual(201);
  // expect(appointment.body.message).toEqual('Appointment created.');
  // expect(appointment.body.success).toBeTruthy();
});
