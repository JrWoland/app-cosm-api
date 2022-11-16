import { UniqueEntityID } from '../../../../core/domain/UniqueId';
import { AccountId } from '../../../accounts/domain/AccountId';
import { Client } from '../Client';
import { ClientStatus } from '../ClientStatus';

const accountId = AccountId.create().getValue();
const clientId = new UniqueEntityID('my-id');
const date = new Date();

const mockClient = () => ({
  accountId: accountId,
  name: 'Name',
  status: ClientStatus.Active,
  surname: 'Surname',
  birthDay: date,
  phone: '123',
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
        phone: '12-12-12',
      },
      new UniqueEntityID(),
    ).getValue();

    expect(client.name).toEqual('Fas');
    expect(client.surname).toEqual('Bar');
    expect(client.birthDay).toEqual(date);
    expect(client.email).toEqual('email@email.com');
    expect(client.phone).toEqual('12-12-12');
    expect(client.status).toEqual('ACTIVE');
  });
  it('Should return error when client does not have name.', () => {
    const client = Client.create(
      {
        accountId,
        name: '',
        status: ClientStatus.Active,
      },
      new UniqueEntityID(),
    );

    expect(client.error).toEqual('Client need to have name.');
    expect(client.isFailure).toEqual(true);
  });
  it('Should return error when email is incorrect.', () => {
    const client = Client.create(
      {
        accountId,
        name: 'Fas',
        email: 'asdf#asd.com',
        status: ClientStatus.Active,
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
        status: ClientStatus.Active,
      },
      new UniqueEntityID(),
    );

    expect(client.error).toEqual('Birth day format is not valid.');
    expect(client.isFailure).toEqual(true);
  });
  it('Should return error when status is incorrect', () => {
    const client = Client.create(
      {
        accountId,
        name: 'Fas',
        status: 'FAKE_STATUS' as ClientStatus,
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
        birthDay: new Date(),
        status: ClientStatus.Active,
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
        birthDay: new Date(),
        status: ClientStatus.Active,
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
    data.birthDay = new Date('2013-12-12');
    data.phone = '567';
    data.status = ClientStatus.Archived;

    const updatedClient = client.updateDetails(data);

    expect(updatedClient.isSuccess).toEqual(true);
    expect(updatedClient.getValue()).toContain('Name has been changed.');
    expect(updatedClient.getValue()).toContain('Surname has been changed.');
    expect(updatedClient.getValue()).toContain('Birth day has been changed.');
    expect(updatedClient.getValue()).toContain('Phone number has been changed.');
    expect(updatedClient.getValue()).toContain('Email has been changed.');

    expect(client.accountId).toEqual(accountId);
    expect(client.name).toEqual('Name2');
    expect(client.surname).toEqual('Surname2');
    expect(client.email).toEqual('em2@em2.com');
    expect(client.birthDay).toEqual(new Date('2013-12-12'));
    expect(client.phone).toEqual('567');
    expect(client.status).toEqual(ClientStatus.Active); // this should not update status so expect to be ACTIVE
  });

  it('Should update name only', () => {
    const data = mockClient();
    const client = Client.create(data, clientId).getValue();

    client.updateDetails({ name: 'New' });

    expect(client.name).toEqual('New');

    expect(client.accountId).toEqual(accountId);
    expect(client.surname).toEqual('Surname');
    expect(client.email).toEqual('em@em.com');
    expect(client.birthDay).toEqual(date);
    expect(client.phone).toEqual('123');
    expect(client.status).toEqual(ClientStatus.Active);
  });
  it('Should update surname only', () => {
    const data = mockClient();
    const client = Client.create(data, clientId).getValue();

    client.updateDetails({ name: 'Name', surname: 'New' });

    expect(client.surname).toEqual('New');

    expect(client.accountId).toEqual(accountId);
    expect(client.name).toEqual('Name');
    expect(client.email).toEqual('em@em.com');
    expect(client.birthDay).toEqual(date);
    expect(client.phone).toEqual('123');
    expect(client.status).toEqual(ClientStatus.Active);
  });
  it('Should update birth day only', () => {
    const data = mockClient();
    const client = Client.create(data, clientId).getValue();

    client.updateDetails({ name: 'Name', birthDay: new Date('2011-11-11') });

    expect(client.birthDay).toEqual(new Date('2011-11-11'));

    expect(client.accountId).toEqual(accountId);
    expect(client.name).toEqual('Name');
    expect(client.surname).toEqual('Surname');
    expect(client.email).toEqual('em@em.com');
    expect(client.phone).toEqual('123');
    expect(client.status).toEqual(ClientStatus.Active);
  });
  it('Should update email only', () => {
    const data = mockClient();
    const client = Client.create(data, clientId).getValue();

    client.updateDetails({ name: 'Name', email: 'em2@em2.com' });

    expect(client.email).toEqual('em2@em2.com');

    expect(client.accountId).toEqual(accountId);
    expect(client.name).toEqual('Name');
    expect(client.surname).toEqual('Surname');
    expect(client.birthDay).toEqual(date);
    expect(client.phone).toEqual('123');
    expect(client.status).toEqual(ClientStatus.Active);
  });
  it('Should update phone only', () => {
    const data = mockClient();
    const client = Client.create(data, clientId).getValue();

    client.updateDetails({ name: 'Name', phone: '789' });

    expect(client.phone).toEqual('789');

    expect(client.accountId).toEqual(accountId);
    expect(client.name).toEqual('Name');
    expect(client.surname).toEqual('Surname');
    expect(client.birthDay).toEqual(date);
    expect(client.email).toEqual('em@em.com');
    expect(client.status).toEqual(ClientStatus.Active);
  });
});
