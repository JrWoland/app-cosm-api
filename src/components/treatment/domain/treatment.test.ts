import { UniqueEntityID } from '../../../core/domain/UniqueId';
import { AccountId } from '../../accounts/domain/AccountId';
import { Treatment } from './Treatment';
import { TreatmentCardId } from './TreatmentCardId';

const accountId = AccountId.create().getValue();

const mockTreatment = () => {
  const treatment = Treatment.create(
    {
      accountId: accountId,
      name: 'Lashes example',
      duration: 60,
      notes: '',
      price: 50,
      treatmentCardId: null,
    },
    new UniqueEntityID(),
  ).getValue();
  return treatment;
};

it('Should create Treatment. create()', () => {
  const treatment = mockTreatment();

  expect(treatment.accountId).toEqual(accountId);
  expect(treatment.name).toEqual('Lashes example');
  expect(treatment.duration).toEqual(60);
  expect(treatment.notes).toEqual('');
  expect(treatment.price).toEqual(50);
  expect(treatment.treatmentCardId).toEqual(null);
});

describe('treatment.setName()', () => {
  const treatment = mockTreatment();
  it('Should set name', () => {
    treatment.setName('New name');
    expect(treatment.name).toEqual('New name');
  });
  it('Should throw error when name is not provided', () => {
    const res = treatment.setName('');
    expect(res.error).toEqual('Treatment need to have a name.');
  });
});

describe('treatment.setNotes()', () => {
  const treatment = mockTreatment();
  it('Should set notes', () => {
    const result = treatment.setNotes('New notes');
    expect(treatment.notes).toEqual('New notes');
    expect(result.getValue()).toEqual('Treatment notes has been set.');
  });
});

describe('treatment.setDuration()', () => {
  const treatment = mockTreatment();
  it('Should set duration', () => {
    const result = treatment.setDuration(80);
    expect(treatment.duration).toEqual(80);
    expect(result.getValue()).toEqual('Treatment duration has been set.');
  });
  it('Should throw error when duration is less than 0', () => {
    const result = treatment.setDuration(-1);
    expect(result.error).toEqual('Duration must be greater than 0.');
  });
});

describe('treatment.setPrice()', () => {
  const treatment = mockTreatment();
  it('Should set price', () => {
    const result = treatment.setPrice(80);
    expect(treatment.price).toEqual(80);
    expect(result.getValue()).toEqual('Treatment price has been set.');
  });
  it('Should throw error when Price is less than 0', () => {
    const result = treatment.setPrice(-1);
    expect(result.error).toEqual('Price must be greater than 0.');
  });
});

describe('treatment.setTreatmentCardId()', () => {
  const treatment = mockTreatment();
  it('Should set treatmentCardId', () => {
    const result = treatment.setTreatmentCardId(TreatmentCardId.create(new UniqueEntityID('my-id')).getValue());
    expect(treatment.treatmentCardId?.value).toEqual('my-id');
    expect(result.getValue()).toEqual('Treatment card has been set.');
  });
});
