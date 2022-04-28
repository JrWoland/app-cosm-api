import { UniqueEntityID } from '../../../core/domain/UniqueId';
import { AccountId } from '../../accounts/domain/AccountId';
import { Appointment } from './Appointment';
import { AppointmentStatus } from './AppointmentStatus';

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
  expect(appointment.props.clientId).toEqual(null);
  expect(appointment.props.accountId).toBeInstanceOf(AccountId);
  expect(appointment.props.date).toBeInstanceOf(Date);
  expect(appointment.props.date.toISOString()).toEqual('2020-06-04T22:00:00.000Z');
  expect(appointment.props.startTime).toEqual(40);
  expect(appointment.props.duration).toEqual(40);
  expect(appointment.props.treatments.length).toEqual(0);
  expect(appointment.props.status).toEqual('NEW');
});

it('Update all appointment', async () => {
  const appointment = Appointment.create(testAppointment, new UniqueEntityID('test-id')).getValue();
  appointment.updateAll(updatedAppointment);
  expect(appointment.appointmentId.value).toEqual('test-id');
  expect(appointment.props.clientId).toEqual(null);
  expect(appointment.props.accountId).toBeInstanceOf(AccountId);
  expect(appointment.props.date).toBeInstanceOf(Date);
  expect(appointment.props.date.toISOString()).toEqual('2020-01-31T23:00:00.000Z');
  expect(appointment.props.startTime).toEqual(50);
  expect(appointment.props.duration).toEqual(50);
  expect(appointment.props.treatments.length).toEqual(0);
  expect(appointment.props.status).toEqual('DECLINED');
});

it('Update appointment status', async () => {
  const appointment = Appointment.create(testAppointment).getValue();
  expect(appointment.props.status).toEqual('NEW');
  appointment.updateAppoinmentStatus(AppointmentStatus.ClientNotAppeard);
  expect(appointment.props.status).toEqual('CLIENT_NOT_APPEARD');
  appointment.updateAppoinmentStatus(AppointmentStatus.Finished);
  expect(appointment.props.status).toEqual('FINISHED');
  appointment.updateAppoinmentStatus(AppointmentStatus.Declined);
  expect(appointment.props.status).toEqual('DECLINED');
});
