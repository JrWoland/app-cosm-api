import { AggregateRoot } from '@nestjs/cqrs';
import { AccountId } from 'src/modules/account/domain/AccountId';
import { ClientId } from './ClientId';

import { ClientName } from './ClientName';
import { ClientSurname } from './ClientSurname';
import { ClientStatus } from './ClientStatus';
import { ClientBirthDay } from './ClientBirthDay';
import { ClientPhoneNumber } from './ClientPhone';
import { ClientEmail } from './ClientEmail';

interface IClientProps {
  readonly id: ClientId;
  readonly accountId: AccountId;
  readonly name: ClientName;
  readonly surname: ClientSurname;
  readonly status: ClientStatus;
  readonly birthDay: ClientBirthDay;
  readonly phone: ClientPhoneNumber;
  readonly email: ClientEmail;
}

export class Client extends AggregateRoot {
  private constructor(
    private readonly _id: ClientId,
    private readonly _accountId: AccountId,
    private _name: ClientName,
    private _surname: ClientSurname,
    private _status: ClientStatus,
    private _birthDay: ClientBirthDay,
    private _phone: ClientPhoneNumber,
    private _email: ClientEmail,
  ) {
    super();
  }

  public get id(): ClientId {
    return this._id;
  }

  public get accountId(): AccountId {
    return this._accountId;
  }

  public get name(): ClientName {
    return this._name;
  }

  public get surname(): ClientSurname {
    return this._surname;
  }

  public get status(): ClientStatus {
    return this._status;
  }

  public get birthDay(): ClientBirthDay {
    return this._birthDay;
  }

  public get phone(): ClientPhoneNumber {
    return this._phone;
  }

  public get email(): ClientEmail {
    return this._email;
  }

  public static create(props: IClientProps): Client {
    const { id, accountId, name, surname, birthDay, phone, email, status } = props;

    return new Client(id, accountId, name, surname, status, birthDay, phone, email);
  }
}
