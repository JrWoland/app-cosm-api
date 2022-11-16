import { UniqueEntityID } from '../../../../core/domain/UniqueId';
import { AccountId } from '../../../accounts/domain/AccountId';
import { Treatment } from '../Treatment';

const accountId = AccountId.create().getValue();

const mockTreatment = () => ({
  accountId: accountId,
  name: 'Lashes example',
  duration: 60,
  notes: '',
  price: 50,
  treatmentCardId: undefined,
});

describe('Test create()', () => {
  it('Should create Treatment.', () => {
    const data = mockTreatment();
    const treatment = Treatment.create(data, new UniqueEntityID('my-id')).getValue();

    expect(treatment.accountId).toEqual(accountId);
    expect(treatment.name).toEqual('Lashes example');
    expect(treatment.duration).toEqual(60);
    expect(treatment.notes).toEqual('');
    expect(treatment.price).toEqual(50);
    expect(treatment.treatmentCardId).toEqual(undefined);
  });
  it('Should not create Treatment without accountId property.', () => {
    const data = mockTreatment();
    data.accountId = '' as unknown as AccountId; // force wrong AccountId
    const treatmentResult = Treatment.create(data, new UniqueEntityID('my-id'));

    expect(treatmentResult.isFailure).toEqual(true);
    expect(treatmentResult.error).toEqual('Can not create new treatment without accountId property.');
  });
  it('Should not create Treatment without name property.', () => {
    const data = mockTreatment();
    data.name = ''; // force wrong AccountId
    const treatmentResult = Treatment.create(data, new UniqueEntityID('my-id'));

    expect(treatmentResult.isFailure).toEqual(true);
    expect(treatmentResult.error).toEqual('Can not create new treatment without name property.');
  });
  it('Should not create Treatment without name property.', () => {
    const data = mockTreatment();
    data.duration = -1;
    const treatmentResult = Treatment.create(data, new UniqueEntityID('my-id'));

    expect(treatmentResult.isFailure).toEqual(true);
    expect(treatmentResult.error).toEqual('Duration must be greater than 0.');
  });
  it('Should not create Treatment without name property.', () => {
    const data = mockTreatment();
    data.price = -1;
    const treatmentResult = Treatment.create(data, new UniqueEntityID('my-id'));

    expect(treatmentResult.isFailure).toEqual(true);
    expect(treatmentResult.error).toEqual('Price must be greater than 0.');
  });
});

describe('Test treatment.updateDetails()', () => {
  it('Should update treatment details', () => {
    const data = mockTreatment();

    data.name = 'Test';
    data.duration = 20;
    data.notes = 'notes';
    data.price = 100;

    const treatment = Treatment.create(data, new UniqueEntityID('my-id')).getValue();
    const updatedTreatment = treatment.updateDetails(data);

    expect(updatedTreatment.isSuccess).toEqual(true);
    expect(updatedTreatment.getValue()).toContain('Treatment name has been set.');
    expect(updatedTreatment.getValue()).toContain('Treatment notes has been set.');
    expect(updatedTreatment.getValue()).toContain('Treatment duration has been set.');
    expect(updatedTreatment.getValue()).toContain('Treatment price has been set.');

    expect(treatment.accountId).toEqual(accountId);
    expect(treatment.name).toEqual('Test');
    expect(treatment.duration).toEqual(20);
    expect(treatment.notes).toEqual('notes');
    expect(treatment.price).toEqual(100);
    expect(treatment.treatmentCardId).toEqual(undefined);
  });
  it('Should update treatment name only', () => {
    const data = mockTreatment();

    const treatment = Treatment.create(data, new UniqueEntityID('my-id')).getValue();

    const updatedTreatment = treatment.updateDetails({ name: 'Test' });

    expect(updatedTreatment.isSuccess).toEqual(true);
    expect(updatedTreatment.getValue()).toContain('Treatment name has been set.');

    expect(treatment.accountId).toEqual(accountId);
    expect(treatment.name).toEqual('Test');
    expect(treatment.duration).toEqual(60);
    expect(treatment.notes).toEqual('');
    expect(treatment.price).toEqual(50);
    expect(treatment.treatmentCardId).toEqual(undefined);
  });
  it('Should update treatment notes only', () => {
    const data = mockTreatment();

    const treatment = Treatment.create(data, new UniqueEntityID('my-id')).getValue();

    const updatedTreatment = treatment.updateDetails({ name: 'Lashes', notes: 'new' });

    expect(updatedTreatment.isSuccess).toEqual(true);
    expect(updatedTreatment.getValue()).toContain('Treatment notes has been set.');

    expect(treatment.accountId).toEqual(accountId);
    expect(treatment.name).toEqual('Lashes');
    expect(treatment.duration).toEqual(60);
    expect(treatment.notes).toEqual('new');
    expect(treatment.price).toEqual(50);
    expect(treatment.treatmentCardId).toEqual(undefined);
  });
  it('Should update treatment duration only', () => {
    const data = mockTreatment();

    const treatment = Treatment.create(data, new UniqueEntityID('my-id')).getValue();

    const updatedTreatment = treatment.updateDetails({ name: 'Lashes', duration: 10 });

    expect(updatedTreatment.isSuccess).toEqual(true);
    expect(updatedTreatment.getValue()).toContain('Treatment duration has been set.');

    expect(treatment.accountId).toEqual(accountId);
    expect(treatment.name).toEqual('Lashes');
    expect(treatment.duration).toEqual(10);
    expect(treatment.notes).toEqual('');
    expect(treatment.price).toEqual(50);
    expect(treatment.treatmentCardId).toEqual(undefined);
  });
  it('Should update treatment price only', () => {
    const data = mockTreatment();

    const treatment = Treatment.create(data, new UniqueEntityID('my-id')).getValue();

    const updatedTreatment = treatment.updateDetails({ name: 'Lashes', price: 100 });

    expect(updatedTreatment.isSuccess).toEqual(true);
    expect(updatedTreatment.getValue()).toContain('Treatment price has been set.');

    expect(treatment.accountId).toEqual(accountId);
    expect(treatment.name).toEqual('Lashes');
    expect(treatment.duration).toEqual(60);
    expect(treatment.notes).toEqual('');
    expect(treatment.price).toEqual(100);
    expect(treatment.treatmentCardId).toEqual(undefined);
  });
  it('Should throw error when name is not provided', () => {
    const data = mockTreatment();
    const treatment = Treatment.create(data, new UniqueEntityID('my-id')).getValue();
    data.name = '';
    const updatedTreatment = treatment.updateDetails(data);

    expect(updatedTreatment.error).toEqual('Treatment need to have a name.');
  });
  it('Should throw error when duration is less than 0', () => {
    const data = mockTreatment();
    const treatment = Treatment.create(data, new UniqueEntityID('my-id')).getValue();
    data.duration = -1;
    const updatedTreatment = treatment.updateDetails(data);

    expect(updatedTreatment.error).toEqual('Duration must be greater than 0.');
  });
  it('Should throw error when price is less than 0', () => {
    const data = mockTreatment();
    const treatment = Treatment.create(data, new UniqueEntityID('my-id')).getValue();
    data.price = -1;
    const updatedTreatment = treatment.updateDetails(data);

    expect(updatedTreatment.error).toEqual('Price must be greater than 0.');
  });
});
