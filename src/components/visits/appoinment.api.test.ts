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
const testUser2 = { email: 'test2@test2.com', password: 'testtest2' };

const testAppointment = {
  clientId: null,
  date: Date.now(),
  startTime: 500,
  duration: 800,
  treatments: [],
};

it('Should create appointment /api/appointment/create', async () => {
  const appointment = await request(app).post('/api/appointment/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testAppointment);
  expect(appointment.status).toEqual(201);
  expect(appointment.body.message).toEqual('Appointment created.');
  expect(appointment.body.appointmentId).toBeTruthy();

  const result = await AppointmentModel.exists({ _id: appointment.body.appointmentId });
  expect(result).toEqual(true);

  await AppointmentModel.deleteOne({ _id: appointment.body.appointmentId });
});

const getMock = () => ({
  appointmentId: null,
  clientId: null,
  date: Date.now(),
  startTime: 0,
  duration: 0,
  treatments: [],
  status: 'RANDOM_VALUE',
});

describe('Test update appointment scenarios /api/appointment/update when:', () => {
  it('Should not update the appointment when duration or startTime is 0 or less', async () => {
    const result = await request(app).post('/api/appointment/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testAppointment);
    const updated = getMock();
    updated.appointmentId = result.body.appointmentId;
    updated.duration = 0;

    const updatedAppointment = await request(app).patch('/api/appointment/update').auth(testUser.email, testUser.password, { type: 'basic' }).send(updated);

    expect(updatedAppointment.status).toEqual(422);
    expect(updatedAppointment.body.message).toContain('Duration must be grater than 0.');
    expect(updatedAppointment.body.message).toContain('Start time must be grater than 0.');
    expect(updatedAppointment.body.message).toContain('Status is not valid: RANDOM_VALUE.');
  });

  it('Should not update the appointment when appointmentId is null.', async () => {
    await request(app).post('/api/appointment/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testAppointment);
    const updated = getMock();
    updated.appointmentId = null;
    updated.duration = 500;

    const updatedAppointment = await request(app).patch('/api/appointment/update').auth(testUser.email, testUser.password, { type: 'basic' }).send(updated);

    expect(updatedAppointment.status).toEqual(422);
    expect(updatedAppointment.body.message).toEqual('Invalid appointment id.');
  });

  it('Should not be able to update appointment from another account.', async () => {
    const result = await request(app).post('/api/appointment/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testAppointment);
    const updated = getMock();
    updated.appointmentId = result.body.appointmentId;
    updated.duration = 500;

    const updatedAppointment = await request(app).patch('/api/appointment/update').auth(testUser2.email, testUser2.password, { type: 'basic' }).send(updated);

    expect(updatedAppointment.status).toEqual(422);
    expect(updatedAppointment.body.message).toEqual('Appointment not found.');
  });
});
