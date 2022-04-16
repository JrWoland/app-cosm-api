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

const testAppointment = {
  clientId: null,
  date: Date.now(),
  startTime: 500,
  duration: 800,
  treatments: [],
};

it('Create appointment /appointment/create', async () => {
  const appointment = await request(app).post('/api/appointment/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testAppointment);
  expect(appointment.status).toEqual(201);
  expect(appointment.body.message).toEqual('Appointment created.');
  expect(appointment.body.appointmentId).toBeTruthy();

  await AppointmentModel.deleteOne({ _id: appointment.body.appointmentId });
});

it('Update testAppointment /appointment', async () => {
  //create Appointment
  await request(app).post('/api/appointment/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testAppointment);

  // and update
  const updatedAppointment = await request(app).patch('/api/appointment/update').auth(testUser.email, testUser.password, { type: 'basic' }).send({
    clientId: null,
    date: Date.now(),
    startTime: 1000,
    duration: 1000,
    treatments: [],
  });
  expect(updatedAppointment.status).toEqual(200);
  expect(updatedAppointment.body.message).toEqual('Appointment updated.');
  expect(updatedAppointment.body.appointmentId).toBeTruthy();

  // and delete
  await AppointmentModel.deleteOne({ _id: updatedAppointment.body.appointmentId });
});
