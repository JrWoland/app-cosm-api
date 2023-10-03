import { UniqueEntityID } from '../../../../core/domain/UniqueId';
import { AccountId } from '../../../accounts/domain/AccountId';
import { Appointment } from '../Appointment';
import { Treatment } from '../Treatment';
import { Treatments } from '../Treatments';

const testAppointment = () => ({
  accountId: AccountId.create().getValue().id.getValue(),
  date: new Date(2020, 5, 5).toISOString(),
  duration: 40,
  status: 'NEW',
  startTime: 40,
  clientId: '123',
  treatments: Treatments.create([]),
});

const updatedAppointment = () => ({
  accountId: AccountId.create().getValue().id.getValue(),
  date: new Date(2020, 1, 1).toISOString(),
  duration: 50,
  status: 'DECLINED',
  startTime: 50,
  clientId: '123',
  treatments: Treatments.create([]),
});

describe('Test create().', () => {
  it('Should create appointment', async () => {
    const appointment = Appointment.create(testAppointment()).getValue();
    expect(appointment.clientId?.value).toEqual('123');
    expect(appointment.accountId).toBeInstanceOf(AccountId);
    expect(appointment.date?.toISOString()).toEqual('2020-06-04T22:00:00.000Z');
    expect(appointment.startTime.value).toEqual(40);
    expect(appointment.duration.value).toEqual(40);
    expect(appointment.treatments.list.length).toEqual(0);
    expect(appointment.status.value).toEqual('NEW');
  });
  it('Should not create appointment with foreign accountId', async () => {
    const treatment = Treatment.create({ accountId: AccountId.create().getValue(), name: 'Fake', duration: 0, notes: '', price: 0, assingedCardId: undefined }, new UniqueEntityID());

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
    expect(appointment.status.value).toEqual('NEW');

    appointment.setAppointmentStatus('CLIENT_NOT_APPEARD');
    expect(appointment.status.value).toEqual('CLIENT_NOT_APPEARD');

    appointment.setAppointmentStatus('FINISHED');
    expect(appointment.status.value).toEqual('FINISHED');

    appointment.setAppointmentStatus('DECLINED');
    expect(appointment.status.value).toEqual('DECLINED');
  });

  it('Should not update appointment status', async () => {
    const appointment = Appointment.create(testAppointment()).getValue();
    const result = appointment.setAppointmentStatus('FAKE');

    expect(result.isFailure).toEqual(true);
    expect(result.error).toEqual('Invalid appointment status.');
  });
});

describe('Test addTreatment().', () => {
  it('Should add treatment', async () => {
    const appointment = Appointment.create(testAppointment()).getValue();
    const treatment = Treatment.create(
      {
        accountId: AccountId.create(new UniqueEntityID(testAppointment().accountId)).getValue(),
        name: 'Test',
        assingedCardId: undefined,
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
        accountId: AccountId.create(new UniqueEntityID(testAppointment().accountId)).getValue(),
        name: 'Test',
        assingedCardId: undefined,
        duration: 500,
        notes: '',
        price: 12,
      },
      new UniqueEntityID('test-treatment1'),
    );
    const treatment2 = Treatment.create(
      {
        accountId: AccountId.create(new UniqueEntityID(testAppointment().accountId)).getValue(),
        name: 'Test',
        assingedCardId: undefined,
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
    expect(appointment.clientId?.value).toEqual('123');
    expect(appointment.date?.toISOString()).toEqual('2020-01-31T23:00:00.000Z');
    expect(appointment.startTime.value).toEqual(50);
    expect(appointment.duration.value).toEqual(50);
    expect(appointment.treatments.list.length).toEqual(0);
    expect(appointment.status.value).toEqual('NEW');
  });

  it('Should not update appointment duration', async () => {
    const appointment = Appointment.create(testAppointment(), new UniqueEntityID('test-id')).getValue();
    const updated = updatedAppointment();
    updated.duration = -1;
    const result = appointment.updateDetails(updated);

    expect(result.isFailure).toEqual(true);
    expect(result.error).toEqual('Duration must be greater than 0. Provided duration: -1');
  });

  it('Set wrong start time.', async () => {
    const appointment = Appointment.create(testAppointment(), new UniqueEntityID('test-id')).getValue();
    const updated = updatedAppointment();
    updated.startTime = -1;
    const result = appointment.updateDetails(updated);

    expect(result.isFailure).toEqual(true);
    expect(result.error).toEqual('Start time must be greater than 0. Provided start time: 0.');
  });

  it('Set wrong appointment date.', async () => {
    const appointment = Appointment.create(testAppointment(), new UniqueEntityID('test-id')).getValue();
    const updated = updatedAppointment();
    updated.date = 'fake format';
    const result = appointment.updateDetails(updated);

    expect(result.isFailure).toEqual(true);
    expect(result.error).toEqual('Appointment date is not valid: fake format');
  });
});
