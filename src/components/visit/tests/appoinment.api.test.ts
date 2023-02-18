import { ExpressServer } from '../../../infra/server/server';
import mongoose from 'mongoose';
import request from 'supertest';
import { AppointmentModel } from '../../../infra/db/models/appointmentModel';
import { TreatmentModel } from '../../../infra/db/models/treatmentModel';
import { initConnection } from '../../../infra/db/mongo';

const app = new ExpressServer().create();

// beforeEach((done) => {
//   mongoose.connect('mongodb://localhost:27017/cosm-local', { useNewUrlParser: true, useUnifiedTopology: true }, () => done());
// });

beforeEach((done) => {
  initConnection();
  done();
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

const getMockAppointment = () => ({
  appointmentId: null,
  clientId: null,
  date: Date.now(),
  startTime: 0,
  duration: 0,
  treatments: [],
  status: 'RANDOM_VALUE',
});

describe('/api/appointment/create', () => {
  it('Should create appointment', async () => {
    const appointment = await request(app).post('/api/appointment/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testAppointment);
    expect(appointment.status).toEqual(201);
    expect(appointment.body.message).toEqual('Appointment created.');
    expect(appointment.body.appointmentId).toBeTruthy();

    const result = await AppointmentModel.exists({ _id: appointment.body.appointmentId });
    expect(result).toEqual(true);

    await AppointmentModel.deleteOne({ _id: appointment.body.appointmentId });
  });
  it('Should not create appointment when some treatment does not belong to account', async () => {
    const tr = {
      name: 'Testing',
      treatmentCardId: null,
      startTime: '20',
      duration: '120',
    } as never;

    const treatment = await request(app).post('/api/treatment/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(tr);
    expect(treatment.status).toEqual(201);
    expect(treatment.body.message).toEqual('Treatment created.');

    const result = await TreatmentModel.exists({ _id: treatment.body.treatmentId });
    expect(result).toEqual(true);

    const mockAppointment = getMockAppointment();
    mockAppointment.status = 'NEW';
    mockAppointment.treatments.push({
      id: treatment.body.treatmentId,
      startTime: '20',
      duration: '120',
    } as never);

    const appointment = await request(app).post('/api/appointment/create').auth(testUser2.email, testUser2.password, { type: 'basic' }).send(mockAppointment);
    expect(appointment.status).toEqual(422);
    expect(appointment.body.message).toEqual(`Appointment could not be created. Could not find treatment with id: ${treatment.body.treatmentId}`);
    expect(appointment.body.appointmentId).toBeFalsy();

    await TreatmentModel.deleteOne({ _id: appointment.body.treatmentId });
  });
});

describe('/api/appointment/update', () => {
  it('Should not update the appointment when duration or startTime is 0 or less', async () => {
    const result = await request(app).post('/api/appointment/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testAppointment);
    const updated = getMockAppointment();
    updated.appointmentId = result.body.appointmentId;
    updated.duration = 0;

    const updatedAppointment = await request(app).patch('/api/appointment/update').auth(testUser.email, testUser.password, { type: 'basic' }).send(updated);

    expect(updatedAppointment.status).toEqual(422);
    expect(updatedAppointment.body.message).toContain('Duration must be greater than 0.');
    expect(updatedAppointment.body.message).toContain('Start time must be greater than 0.');
    expect(updatedAppointment.body.message).toContain('Status is not valid: RANDOM_VALUE.');

    await AppointmentModel.deleteOne({ _id: result.body.appointmentId });
  });

  it('Should not update the appointment when appointmentId is null.', async () => {
    await request(app).post('/api/appointment/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testAppointment);
    const updated = getMockAppointment();
    updated.appointmentId = null;
    updated.duration = 500;

    const updatedAppointment = await request(app).patch('/api/appointment/update').auth(testUser.email, testUser.password, { type: 'basic' }).send(updated);

    expect(updatedAppointment.status).toEqual(422);
    expect(updatedAppointment.body.message).toEqual('Invalid appointment id.');
  });

  it('Should not be able to access appointment from another account.', async () => {
    const result = await request(app).post('/api/appointment/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testAppointment);
    const updated = getMockAppointment();
    updated.appointmentId = result.body.appointmentId;
    updated.duration = 500;

    const updatedAppointment = await request(app).patch('/api/appointment/update').auth(testUser2.email, testUser2.password, { type: 'basic' }).send(updated);

    expect(updatedAppointment.status).toEqual(422);
    expect(updatedAppointment.body.message).toEqual('Appointment could not be updated.');
  });
});

describe('/api/appointment/list', () => {
  it('Should return list of appointments.', async () => {
    const { body, status } = await request(app).get('/api/appointment/list?&page=1&limit=1').auth(testUser.email, testUser.password, { type: 'basic' }).send();

    expect(status).toEqual(200);
    expect(body.count).toBeGreaterThan(1);
    expect(body.totalPages).toBeGreaterThan(1);
    expect(body.currentPage).toEqual(1);
    expect(body.appointments).toBeInstanceOf(Array);
  });

  it('Should return list of appointments with particular type of treatment.', async () => {
    const tr = {
      name: 'Testing list',
      treatmentCardId: null,
      startTime: '20',
      duration: '120',
    } as never;

    // Create treatment type
    const treatment = await request(app).post('/api/treatment/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(tr);
    expect(treatment.status).toEqual(201);
    expect(treatment.body.message).toEqual('Treatment created.');
    expect(treatment.body.treatmentId).toBeTruthy();

    // create appointment with treatment
    const appointment = getMockAppointment();
    appointment.startTime = 600;
    appointment.duration = 120;
    appointment.status = 'NEW';
    appointment.treatments.push({ id: treatment.body.treatmentId, startTime: 500, duration: 60 } as never);
    const appointmentResponse = await request(app).post('/api/appointment/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(appointment);

    expect(appointmentResponse.body.message).toEqual('Appointment created.');

    const { body } = await request(app).get(`/api/appointment/list?&page=1&limit=1&beautyServiceId=${treatment.body.treatmentId}`).auth(testUser.email, testUser.password, { type: 'basic' }).send();

    expect(body.appointments[0]).toHaveProperty('id');
    expect(body.appointments[0]).toHaveProperty('clientId');
    expect(body.appointments[0]).toHaveProperty('date');
    expect(body.appointments[0]).toHaveProperty('status');
    expect(body.appointments[0]).toHaveProperty('duration');
    expect(body.appointments[0]).toHaveProperty('startTime');
    expect(body.appointments[0]).toHaveProperty('treatments');

    expect(body.appointments[0].treatments[0].id).toEqual(treatment.body.treatmentId);
    expect(body.appointments[0].treatments[0].name).toEqual('Testing list');
    expect(body.appointments[0].treatments[0].startTime).toEqual(500);
    expect(body.appointments[0].treatments[0].duration).toEqual(60);

    await AppointmentModel.deleteOne({ _id: appointmentResponse.body.appointmentId });
    await TreatmentModel.deleteOne({ _id: treatment.body.treatmentId });
  });
});
// describe('Test delete appointment.', () => {
//   it('Should be able to delete the appointment.', async () => {
//     const result = await request(app).post('/api/appointment/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testAppointment);
//     const resultDeleted = await request(app).delete('/api/appointment/delete').auth(testUser.email, testUser.password, { type: 'basic' }).send({ appointmentId: result.body.appointmentId });

//     expect(resultDeleted.status).toEqual(200);
//     expect(resultDeleted.status).toEqual('Appointment has been deleted.');
//   });
// });
