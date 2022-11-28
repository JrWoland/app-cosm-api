import { UniqueEntityID } from '../../../../core/domain/UniqueId';
import { AccountId } from '../../../accounts/domain/AccountId';
import { Appointment } from '../Appointment';
import { AppointmentStatus } from '../AppointmentStatus';
import { Treatment } from '../Treatment';
import { Treatments } from '../Treatments';

const testAppointment = () => ({
  accountId: AccountId.create().getValue(),
  date: new Date(2020, 5, 5),
  duration: 40,
  status: AppointmentStatus.New,
  startTime: 40,
  clientId: null,
  treatments: Treatments.create([]),
});

const updatedAppointment = () => ({
  accountId: AccountId.create().getValue(),
  date: new Date(2020, 1, 1),
  duration: 50,
  status: AppointmentStatus.Declined,
  startTime: 50,
  clientId: null,
  treatments: Treatments.create([]),
});

describe('Test create().', () => {
  it('Should create appointment', async () => {
    const appointment = Appointment.create(testAppointment()).getValue();
    expect(appointment.clientId).toEqual(null);
    expect(appointment.accountId).toBeInstanceOf(AccountId);
    expect(appointment.date).toBeInstanceOf(Date);
    expect(appointment.date.toISOString()).toEqual('2020-06-04T22:00:00.000Z');
    expect(appointment.startTime).toEqual(40);
    expect(appointment.duration).toEqual(40);
    expect(appointment.treatments.list.length).toEqual(0);
    expect(appointment.status).toEqual('NEW');
  });
  it('Should not create appointment with foreign accountId', async () => {
    const treatment = Treatment.create({ accountId: AccountId.create().getValue(), name: 'Fake', duration: 0, notes: '', price: 0, treatmentCardId: undefined }, new UniqueEntityID());

    const testApp = testAppointment();

    testApp.treatments = Treatments.create([treatment.getValue()]);

    const appointment = Appointment.create(testApp);

    expect(appointment.isFailure).toEqual(true);
    expect(appointment.error).toEqual('Treatment not found.');
  });
});

describe('Test setAppointmentStatus().', () => {
  it('Should update appointment status', async () => {
    const appointment = Appointment.create(testAppointment()).getValue();
    expect(appointment.status).toEqual('NEW');

    appointment.setAppointmentStatus(AppointmentStatus.ClientNotAppeard);
    expect(appointment.status).toEqual('CLIENT_NOT_APPEARD');

    appointment.setAppointmentStatus(AppointmentStatus.Finished);
    expect(appointment.status).toEqual('FINISHED');

    appointment.setAppointmentStatus(AppointmentStatus.Declined);
    expect(appointment.status).toEqual('DECLINED');
  });

  it('Should not update appointment status', async () => {
    const appointment = Appointment.create(testAppointment()).getValue();
    const result = appointment.setAppointmentStatus('FAKE' as AppointmentStatus);

    expect(result.isFailure).toEqual(true);
    expect(result.error).toEqual('Invalid appointment status.');
  });
});

describe('Test addTreatment().', () => {
  it('Should add treatment', async () => {
    const appointment = Appointment.create(testAppointment()).getValue();
    const treatment = Treatment.create(
      {
        accountId: testAppointment().accountId,
        name: 'Test',
        treatmentCardId: undefined,
        duration: 500,
        notes: '',
        price: 12,
      },
      new UniqueEntityID('test-treatment'),
    );
    expect(appointment.treatments.list.length).toEqual(0);
    const result = appointment.addTreatment(treatment.getValue());

    expect(result.isSuccess).toEqual(true);
    expect(result.getValue()).toEqual('Treatment added.');
    expect(appointment.treatments.list.length).toEqual(1);
  });
});

describe('Test removeTreatment().', () => {
  it('Should remove treatment', () => {
    const appointment = Appointment.create(testAppointment()).getValue();
    const treatment1 = Treatment.create(
      {
        accountId: testAppointment().accountId,
        name: 'Test',
        treatmentCardId: undefined,
        duration: 500,
        notes: '',
        price: 12,
      },
      new UniqueEntityID('test-treatment1'),
    );
    const treatment2 = Treatment.create(
      {
        accountId: testAppointment().accountId,
        name: 'Test',
        treatmentCardId: undefined,
        duration: 500,
        notes: '',
        price: 12,
      },
      new UniqueEntityID('test-treatment2'),
    );
    appointment.addTreatment(treatment1.getValue());
    appointment.addTreatment(treatment2.getValue());
    expect(appointment.treatments.list.length).toEqual(2);

    const result = appointment.removeTreatment(treatment2.getValue());
    expect(result.isSuccess).toEqual(true);
    expect(result.getValue()).toEqual('Treatment has been removed.');
    expect(appointment.treatments.list.length).toEqual(1);
    expect(appointment.treatments.list[0].treatmentId.value).toEqual('test-treatment1');
  });
});

describe('Test updateDetails().', () => {
  it('Should update appointment', async () => {
    const appointment = Appointment.create(testAppointment(), new UniqueEntityID('test-id')).getValue();
    const result = appointment.updateDetails(updatedAppointment());

    expect(result.isSuccess).toEqual(true);
    expect(result.getValue()).toEqual('Appointment updated successfully.');

    expect(appointment.appointmentId.value).toEqual('test-id');
    expect(appointment.clientId).toEqual(null);
    expect(appointment.accountId).toBeInstanceOf(AccountId);
    expect(appointment.date).toBeInstanceOf(Date);
    expect(appointment.date.toISOString()).toEqual('2020-01-31T23:00:00.000Z');
    expect(appointment.startTime).toEqual(50);
    expect(appointment.duration).toEqual(50);
    expect(appointment.treatments.list.length).toEqual(0);
    expect(appointment.status).toEqual('DECLINED');
  });

  it('Should not update appointment duration', async () => {
    const appointment = Appointment.create(testAppointment(), new UniqueEntityID('test-id')).getValue();
    const updated = updatedAppointment();
    updated.duration = -1;
    const result = appointment.updateDetails(updated);

    expect(result.isFailure).toEqual(true);
    expect(result.error).toEqual('Duration must be greater than 0.');
  });

  it('Set wrong start time.', async () => {
    const appointment = Appointment.create(testAppointment(), new UniqueEntityID('test-id')).getValue();
    const updated = updatedAppointment();
    updated.startTime = -1;
    const result = appointment.updateDetails(updated);

    expect(result.isFailure).toEqual(true);
    expect(result.error).toEqual('Start time must be greater than 0.');
  });

  it('Set wrong appointment date.', async () => {
    const appointment = Appointment.create(testAppointment(), new UniqueEntityID('test-id')).getValue();
    const updated = updatedAppointment();
    updated.date = 'fake' as unknown as Date; // force to put wrong value to setAppointmentDate() method
    const result = appointment.updateDetails(updated);

    expect(result.isFailure).toEqual(true);
    expect(result.error).toEqual('Date must be instance of Date.');
  });
});