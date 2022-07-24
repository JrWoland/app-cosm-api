import { UniqueEntityID } from '../../../core/domain/UniqueId';
import { AccountId } from '../../accounts/domain/AccountId';
import { Appointment } from './Appointment';
import { AppointmentStatus } from './AppointmentStatus';
import { Treatment } from '../../treatment/domain/Treatment';

const testAppointment = {
  accountId: AccountId.create().getValue(),
  date: new Date(2020, 5, 5),
  duration: 40,
  status: AppointmentStatus.New,
  startTime: 40,
  clientId: null,
  treatments: [],
};

const updatedAppointment = {
  accountId: AccountId.create().getValue(),
  date: new Date(2020, 1, 1),
  duration: 50,
  status: AppointmentStatus.Declined,
  startTime: 50,
  clientId: null,
  treatments: [],
};

it('Create appointment', async () => {
  const appointment = Appointment.create(testAppointment).getValue();
  expect(appointment.clientId).toEqual(null);
  expect(appointment.accountId).toBeInstanceOf(AccountId);
  expect(appointment.date).toBeInstanceOf(Date);
  expect(appointment.date.toISOString()).toEqual('2020-06-04T22:00:00.000Z');
  expect(appointment.startTime).toEqual(40);
  expect(appointment.duration).toEqual(40);
  expect(appointment.treatments.length).toEqual(0);
  expect(appointment.status).toEqual('NEW');
});

it('Update all appointment', async () => {
  const appointment = Appointment.create(testAppointment, new UniqueEntityID('test-id')).getValue();
  appointment.updateAll(updatedAppointment);
  expect(appointment.appointmentId.value).toEqual('test-id');
  expect(appointment.clientId).toEqual(null);
  expect(appointment.accountId).toBeInstanceOf(AccountId);
  expect(appointment.date).toBeInstanceOf(Date);
  expect(appointment.date.toISOString()).toEqual('2020-01-31T23:00:00.000Z');
  expect(appointment.startTime).toEqual(50);
  expect(appointment.duration).toEqual(50);
  expect(appointment.treatments.length).toEqual(0);
  expect(appointment.status).toEqual('DECLINED');
});

it('Update appointment status', async () => {
  const appointment = Appointment.create(testAppointment).getValue();
  expect(appointment.status).toEqual('NEW');
  appointment.setAppointmentStatus(AppointmentStatus.ClientNotAppeard);
  expect(appointment.status).toEqual('CLIENT_NOT_APPEARD');
  appointment.setAppointmentStatus(AppointmentStatus.Finished);
  expect(appointment.status).toEqual('FINISHED');
  appointment.setAppointmentStatus(AppointmentStatus.Declined);
  expect(appointment.status).toEqual('DECLINED');
});

it('Add treatment', async () => {
  const appointment = Appointment.create(testAppointment).getValue();
  const treatment = Treatment.create(
    {
      accountId: testAppointment.accountId,
      name: '',
      treatmentCardId: null,
      duration: 500,
      notes: '',
      price: 12,
    },
    new UniqueEntityID('test-treatment'),
  );
  expect(appointment.treatments.length).toEqual(0);
  const result = appointment.addTreatment(treatment.getValue().treatmentId);

  expect(result.isSuccess).toEqual(true);
  expect(result.getValue()).toEqual('Treatment added.');
  expect(appointment.treatments.length).toEqual(1);
});

describe('Test updating particular props with wrong values.', () => {
  const appointment = Appointment.create(testAppointment).getValue();
  it('Set wrong status.', async () => {
    const result = appointment.setAppointmentStatus('FAKE' as AppointmentStatus);
    expect(result.isFailure).toEqual(true);
    expect(result.error).toEqual('Invalid appoinment status.');
  });
  it('Set wrong duration.', async () => {
    const result = appointment.setAppointmentDuration(-1);
    expect(result.isFailure).toEqual(true);
    expect(result.error).toEqual('Duration must be bigger than 0.');
  });
  it('Set wrong start time.', async () => {
    const result = appointment.setAppointmentStartTime(-1);
    expect(result.isFailure).toEqual(true);
    expect(result.error).toEqual('Start time must be bigger than 0.');
  });
});
