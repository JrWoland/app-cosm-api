import { UniqueEntityID } from '../../../core/domain/UniqueId';
import { AccountId } from '../../accounts/domain/AccountId';
import { Client } from './Client';

const accountId = AccountId.create().getValue();
const date = new Date();

it('Should create client', async () => {
  const client = Client.create(
    {
      accountId,
      name: 'Fas',
      surname: 'Bar',
      birthDay: date,
      email: 'email@email.com',
      phone: '12-12-12',
    },
    new UniqueEntityID(),
  ).getValue();

  expect(client.name).toEqual('Fas');
  expect(client.surname).toEqual('Bar');
  expect(client.birthDay).toEqual(date);
  expect(client.email).toEqual('email@email.com');
  expect(client.phone).toEqual('12-12-12');
});

it('Should return error when client does not have name.', () => {
  const client = Client.create(
    {
      accountId,
      name: '',
    },
    new UniqueEntityID(),
  );

  expect(client.error).toEqual('Client need to have name.');
  expect(client.isFailure).toEqual(true);
});

describe('Should return error when email is incorrect.', () => {
  const client = Client.create(
    {
      accountId,
      name: 'Fas',
      email: 'asdf#asd.com',
    },
    new UniqueEntityID(),
  );
  expect(client.error).toEqual('Email structure is invalid.');
  expect(client.isFailure).toEqual(true);
});

it('Should return error when birthDay format is incorrect.', () => {
  const client = Client.create(
    {
      accountId,
      name: 'Fas',
      birthDay: new Date('bar'),
    },
    new UniqueEntityID(),
  );

  expect(client.error).toEqual('Birth day format is not valid.');
  expect(client.isFailure).toEqual(true);
});
