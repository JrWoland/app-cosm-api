import { ExpressServer } from '../../../infra/server/server';
import mongoose from 'mongoose';
import request from 'supertest';
import { AppointmentModel } from '../../../infra/db/models/appointmentModel';
import { TreatmentModel } from '../../../infra/db/models/treatmentModel';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { ClientModel } from '../../../infra/db/models/clientModel';
dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const app = new ExpressServer().create();

beforeEach((done) => {
  mongoose.connect('mongodb://127.0.0.1:27017/cosm-local', { useNewUrlParser: true, useUnifiedTopology: true }, () => done());
});

afterEach((done) => {
  mongoose.connection.close(() => done());
});

// const getCookie = (cookie: string) => {
//   return Object.fromEntries(cookie.split(';').map((i: string) => i.trim().split('=')));
// };

const testUser = { email: 'test@test.com', password: 'testtest' };
const testUser2 = { email: 'test2@test2.com', password: 'testtest2' };

const testAppointment = {
  clientId: null,
  date: new Date('2019-01-01').toISOString(),
  startTime: 500,
  duration: 800,
  treatments: [],
};

const getMockAppointment = () => ({
  appointmentId: null,
  clientId: null,
  date: new Date('2019-01-01').toISOString(),
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

    await TreatmentModel.deleteOne({ _id: treatment.body.treatmentId });
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
    const result = await request(app).post('/api/appointment/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testAppointment);
    const updated = getMockAppointment();
    updated.appointmentId = null;
    updated.duration = 500;

    const updatedAppointment = await request(app).patch('/api/appointment/update').auth(testUser.email, testUser.password, { type: 'basic' }).send(updated);

    expect(updatedAppointment.status).toEqual(422);
    expect(updatedAppointment.body.message).toEqual('Invalid appointment id.');

    await AppointmentModel.deleteOne({ _id: result.body.appointmentId });
  });

  it('Should not be able to access appointment from another account.', async () => {
    const result = await request(app).post('/api/appointment/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testAppointment);
    const updated = getMockAppointment();
    updated.appointmentId = result.body.appointmentId;
    updated.duration = 500;

    const updatedAppointment = await request(app).patch('/api/appointment/update').auth(testUser2.email, testUser2.password, { type: 'basic' }).send(updated);

    expect(updatedAppointment.status).toEqual(422);
    expect(updatedAppointment.body.message).toEqual('Appointment could not be updated.');

    await AppointmentModel.deleteOne({ _id: result.body.appointmentId });
  });
});

describe('/api/appointment/list', () => {
  it('Should return list of appointments.', async () => {
    const appointment1 = await request(app).post('/api/appointment/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testAppointment);
    const appointment2 = await request(app).post('/api/appointment/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testAppointment);

    const { body, status } = await request(app).get('/api/appointment/list?&page=1&limit=2').auth(testUser.email, testUser.password, { type: 'basic' }).send();

    expect(status).toEqual(200);
    expect(body.count).toBeGreaterThan(1);
    expect(body.totalPages).toBeGreaterThan(1);
    expect(body.currentPage).toEqual(1);
    expect(body.appointments.length).toEqual(2);
    expect(body.appointments).toBeInstanceOf(Array);

    await AppointmentModel.deleteOne({ _id: appointment1.body.appointmentId });
    await AppointmentModel.deleteOne({ _id: appointment2.body.appointmentId });
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
    appointment.treatments.push({ id: treatment.body.treatmentId, startTime: 123, duration: 15 } as never);
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
    expect(body.appointments[0].treatments[0].startTime).toEqual(123);
    expect(body.appointments[0].treatments[0].duration).toEqual(15);

    await AppointmentModel.deleteOne({ _id: appointmentResponse.body.appointmentId });
    await TreatmentModel.deleteOne({ _id: treatment.body.treatmentId });
  });

  it('Should return appointments within particular date range', async () => {
    const appo1 = getMockAppointment();
    const appo2 = getMockAppointment();

    appo1.status = 'NEW';
    appo1.startTime = 1;
    appo1.duration = 1;
    appo1.date = new Date('2020-01-01').toISOString();

    appo2.status = 'NEW';
    appo2.startTime = 1;
    appo2.duration = 1;
    appo2.date = new Date('2022-01-01').toISOString();

    const appointment1 = await request(app).post('/api/appointment/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(appo1);
    const appointment2 = await request(app).post('/api/appointment/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(appo2);

    const result2 = await request(app).get(`/api/appointment/list?dateTo=2020-01-01`).auth(testUser.email, testUser.password, { type: 'basic' }).send(testAppointment);
    expect(result2.body.appointments.every((item: { date: string }) => dayjs(item.date).isSameOrBefore('2020-01-01', 'day'))).toEqual(true);

    const result4 = await request(app).get(`/api/appointment/list?dateFrom=2020-01-02`).auth(testUser.email, testUser.password, { type: 'basic' }).send(testAppointment);
    expect(result4.body.appointments.every((item: { date: string }) => dayjs(item.date).isSameOrAfter('2020-01-02', 'day'))).toEqual(true);

    const result1 = await request(app).get(`/api/appointment/list?dateFrom=2020-01-01&dateTo=2020-01-02`).auth(testUser.email, testUser.password, { type: 'basic' }).send(testAppointment);
    expect(result1.body.appointments.every((item: { date: string }) => dayjs(item.date).isBetween('2020-01-01', '2020-01-02', 'day', '[]'))).toEqual(true);

    const result3 = await request(app).get(`/api/appointment/list?dateFrom=2020-01-02&dateTo=2022-01-01`).auth(testUser.email, testUser.password, { type: 'basic' }).send(testAppointment);
    expect(result3.body.appointments.every((item: { date: string }) => dayjs(item.date).isBetween('2020-01-02', '2022-01-01', 'day', '[]'))).toEqual(true);

    const result5 = await request(app).get(`/api/appointment/list?dateFrom=2020-01-02&dateTo=2022-01-02`).auth(testUser.email, testUser.password, { type: 'basic' }).send(testAppointment);
    expect(result5.body.appointments.every((item: { date: string }) => dayjs(item.date).isBetween('2020-01-01', '2022-01-02', 'day', '[]'))).toEqual(true);

    await AppointmentModel.deleteOne({ _id: appointment1.body.appointmentId });
    await AppointmentModel.deleteOne({ _id: appointment2.body.appointmentId });
  });
  it('Should return appointments for particualar clientId', async () => {
    const client = { name: 'Client1Name', surname: 'Client1Surname' };
    const clientResult = await request(app).post('/api/client/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(client);

    // create appointment with clientId
    const appointment = getMockAppointment();
    appointment.clientId = clientResult.body.clientId;
    appointment.startTime = 600;
    appointment.duration = 120;
    appointment.status = 'NEW';
    const appointmentResponse = await request(app).post('/api/appointment/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(appointment);

    const { body } = await request(app).get(`/api/appointment/list?&page=1&limit=1&clientId=${clientResult.body.clientId}`).auth(testUser.email, testUser.password, { type: 'basic' }).send();

    expect(body.appointments.every((item: { clientId: string }) => item.clientId === clientResult.body.clientId)).toEqual(true);

    await ClientModel.deleteOne({ _id: clientResult.body.clientId });
    await AppointmentModel.deleteOne({ _id: appointmentResponse.body.appointmentId });
  });
});

describe('/api/appointment/:id', () => {
  it('Should get appointment by id', async () => {
    const result = await request(app).post('/api/appointment/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testAppointment);

    const { body } = await request(app).get(`/api/appointment/${result.body.appointmentId}`).auth(testUser.email, testUser.password, { type: 'basic' }).send(testAppointment);

    expect(body.id).toEqual(result.body.appointmentId);
    expect(body.clientId).toEqual(null);
    expect(body.date).toEqual(new Date('2019-01-01').toISOString());
    expect(body.startTime).toEqual(500);
    expect(body.duration).toEqual(800);
    expect(body.treatments).toBeInstanceOf(Array);
    expect(body.treatments.length).toEqual(0);
    expect(body.status).toEqual('NEW');

    await AppointmentModel.deleteOne({ _id: result.body.appointmentId });
  });
  it('Should not get appointment from another account', async () => {
    const result = await request(app).post('/api/appointment/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testAppointment);

    const { body, status } = await request(app).get(`/api/appointment/${result.body.appointmentId}`).auth(testUser2.email, testUser2.password, { type: 'basic' }).send(testAppointment);

    expect(status).toEqual(500);
    expect(body.message).toEqual(`Can not find appointment by appointmentId. Appointment with id=${result.body.appointmentId} does not exists.`);

    await AppointmentModel.deleteOne({ _id: result.body.appointmentId });
  });
});

describe('Test delete appointment.', () => {
  it('Should be able to delete the appointment.', async () => {
    const result = await request(app).post('/api/appointment/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testAppointment);
    const resultDeleted = await request(app).delete(`/api/appointment/${result.body.appointmentId}`).auth(testUser.email, testUser.password, { type: 'basic' }).send();

    expect(resultDeleted.status).toEqual(200);
    expect(resultDeleted.body.id).toEqual(result.body.appointmentId);
    expect(resultDeleted.body.count).toEqual(1);
    expect(resultDeleted.body.message).toEqual(`Successfully deleted appointment with id=${result.body.appointmentId}.`);

    // database check
    const dbResult = await AppointmentModel.exists({ _id: result.body.appointmentId });

    expect(dbResult).toEqual(false);
  });
  it('Should not be able to delete the appointment from another account.', async () => {
    const result = await request(app).post('/api/appointment/create').auth(testUser.email, testUser.password, { type: 'basic' }).send(testAppointment);
    const resultDeleted = await request(app).delete(`/api/appointment/${result.body.appointmentId}`).auth(testUser2.email, testUser2.password, { type: 'basic' }).send();

    expect(resultDeleted.status).toEqual(404);
    expect(resultDeleted.body.message).toEqual(`Not found appointment with id=${result.body.appointmentId}.`);

    // database check
    const dbResult = await AppointmentModel.exists({ _id: result.body.appointmentId });
    expect(dbResult).toEqual(true);

    // clear db
    await AppointmentModel.deleteOne({ _id: result.body.appointmentId });
  });
});
