import { UniqueEntityID } from '../../../../core/domain/UniqueId';
import { AccountId } from '../../../accounts/domain/AccountId';
import { Client } from '../Client';
import { ClientStatus } from '../ClientStatus';

const accountId = AccountId.create().getValue().id.getValue();
const clientId = new UniqueEntityID('my-id');
const date = new Date().toISOString();

const mockClient = () => ({
  accountId: accountId,
  name: 'Name',
  status: ClientStatus.Active,
  surname: 'Surname',
  birthDay: date,
  phone: '+48111111111',
  email: 'em@em.com',
});

describe('Test create()', () => {
  it('Should create client', async () => {
    const client = Client.create(
      {
        accountId,
        name: 'Fas',
        surname: 'Bar',
        birthDay: date,
        status: ClientStatus.Active,
        email: 'email@email.com',
        phone: '+48123123123',
      },
      new UniqueEntityID(),
    ).getValue();

    expect(client.name.value).toEqual('Fas');
    expect(client.surname.value).toEqual('Bar');
    expect(client.birthDay.value?.toISOString()).toEqual(date);
    expect(client.email.value).toEqual('email@email.com');
    expect(client.phone.value).toEqual('+48123123123');
    expect(client.status).toEqual('ACTIVE');
  });
  it('Should return error when client does not have name.', () => {
    const client = Client.create(
      {
        accountId,
        name: '',
        status: ClientStatus.Active,
        surname: null,
        birthDay: null,
        phone: null,
        email: null,
      },
      new UniqueEntityID(),
    );

    expect(client.error).toContain('Client need to have name but received: ');
    expect(client.isFailure).toEqual(true);
  });
  it('Should return error when email is incorrect.', () => {
    const client = Client.create(
      {
        accountId,
        name: 'Fas',
        email: 'asdf#asd.com',
        status: ClientStatus.Active,
        surname: null,
        birthDay: null,
        phone: null,
      },
      new UniqueEntityID(),
    );
    expect(client.error).toContain('Email structure is invalid: asdf#asd.com');
    expect(client.isFailure).toEqual(true);
  });
  it('Should return error when birthDay format is incorrect.', () => {
    const client = Client.create(
      {
        accountId,
        name: 'Fas',
        birthDay: 'bar',
        status: ClientStatus.Active,
        surname: null,
        phone: null,
        email: null,
      },
      new UniqueEntityID(),
    );

    expect(client.error).toContain('Birth day format is not valid: bar');
    expect(client.isFailure).toEqual(true);
  });
  it('Should return error when status is incorrect', () => {
    const client = Client.create(
      {
        accountId,
        name: 'Fas',
        status: 'FAKE_STATUS' as ClientStatus,
        surname: null,
        birthDay: null,
        phone: null,
        email: null,
      },
      new UniqueEntityID(),
    );

    expect(client.isSuccess).toEqual(false);
    expect(client.error).toEqual('Invalid client status.');
  });
});

describe('Test setClientStatus()', () => {
  it('Should set client status', () => {
    const client = Client.create(
      {
        accountId,
        name: 'Fas',
        birthDay: date,
        status: ClientStatus.Active,
        surname: null,
        phone: null,
        email: null,
      },
      new UniqueEntityID(),
    ).getValue();

    const res1 = client.setClientStatus(ClientStatus.Active);
    expect(client.status).toEqual('ACTIVE');
    const res2 = client.setClientStatus(ClientStatus.Archived);
    expect(client.status).toEqual('ARCHIVED');
    const res3 = client.setClientStatus(ClientStatus.Banned);
    expect(client.status).toEqual('BANNED');

    [res1, res2, res3].forEach((res) => {
      expect(res.getValue()).toEqual('Client status changed successfully.');
    });
  });
  it('Should not be able to set client status', () => {
    const client = Client.create(
      {
        accountId,
        name: 'Fas',
        birthDay: date,
        status: ClientStatus.Active,
        surname: null,
        phone: null,
        email: null,
      },
      new UniqueEntityID(),
    ).getValue();

    const result = client.setClientStatus('FAKE_STATUS' as ClientStatus);

    expect(result.isSuccess).toEqual(false);
    expect(result.error).toEqual('Invalid client status.');
  });
});

describe('Test updateDetails()', () => {
  it('Should update client', () => {
    const data = mockClient();
    const client = Client.create(data).getValue();

    data.name = 'Name2';
    data.surname = 'Surname2';
    data.email = 'em2@em2.com';
    data.birthDay = '2013-12-12';
    data.phone = '+48222222222';
    data.status = ClientStatus.Archived;

    const updatedClient = client.updateDetails(data);

    expect(updatedClient.isSuccess).toEqual(true);

    expect(client.accountId.id.getValue()).toEqual(accountId);
    expect(client.name.value).toEqual('Name2');
    expect(client.surname.value).toEqual('Surname2');
    expect(client.email.value).toEqual('em2@em2.com');
    expect(client.birthDay.value).toEqual(new Date('2013-12-12'));
    expect(client.phone.value).toEqual('+48222222222');
    expect(client.status).toEqual(ClientStatus.Active); // this should not update status so expect to be ACTIVE
  });

  it('Should set null values for properties', () => {
    const data = mockClient();
    const client = Client.create(data, clientId).getValue();

    client.updateDetails({
      name: 'New',
      email: null,
      birthDay: null,
      surname: null,
      phone: null,
    });

    expect(client.accountId.id.getValue()).toEqual(accountId);

    expect(client.name.value).toEqual('New');
    expect(client.surname.value).toEqual(null);
    expect(client.email.value).toEqual(null);
    expect(client.birthDay.value).toEqual(null);
    expect(client.phone.value).toEqual(null);
    expect(client.status).toEqual(ClientStatus.Active);
  });
  it('Should set null values when property has empty string', () => {
    const data = mockClient();
    const client = Client.create(data, clientId).getValue();

    client.updateDetails({
      name: 'New',
      email: '',
      birthDay: '',
      surname: '',
      phone: '',
    });

    expect(client.accountId.id.getValue()).toEqual(accountId);

    expect(client.name.value).toEqual('New');
    expect(client.surname.value).toEqual(null);
    expect(client.email.value).toEqual(null);
    expect(client.birthDay.value).toEqual(null);
    expect(client.phone.value).toEqual(null);
    expect(client.status).toEqual(ClientStatus.Active);
  });
});
