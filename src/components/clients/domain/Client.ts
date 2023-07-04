import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../../core/domain/UniqueId';
import { Result } from '../../../core/logic/Result';
import { AccountId } from '../../accounts/domain/AccountId';
import { ClientId } from './ClientId';
import { ClientStatus } from './ClientStatus';
import { ClientBirthDay } from './ClientBirthDay';
import { ClientPhoneNumber } from './ClientPhoneNumber';
import { ClientEmail } from './ClientEmail';
import { ClientName } from './ClientName';
import { ClientSurname } from './ClientSurname';

const STATUS_ERROR_MESSAGE = 'Invalid client status.';

interface ClientProps {
  accountId: AccountId;
  name: ClientName;
  status: ClientStatus;
  surname: ClientSurname;
  birthDay: ClientBirthDay;
  phone: ClientPhoneNumber;
  email: ClientEmail;
}

interface IClientProps {
  accountId: string;
  name: string;
  status: string;
  surname?: string | null;
  birthDay?: string | null;
  phone?: string | null;
  email?: string | null;
}

export class Client extends AggregateRoot<ClientProps> {
  private constructor(readonly props: ClientProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public get clientId(): ClientId {
    return ClientId.create(this._uniqueEntityId).getValue();
  }

  public get accountId(): AccountId {
    return this.props.accountId;
  }

  public get name() {
    return this.props.name;
  }

  public get surname() {
    return this.props.surname;
  }

  public get birthDay() {
    return this.props.birthDay;
  }

  public get phone() {
    return this.props.phone;
  }

  public get email() {
    return this.props.email;
  }

  public get status() {
    return this.props.status;
  }

  private static isStatusValid(status: string): boolean {
    return [ClientStatus.Active.toString(), ClientStatus.Archived.toString(), ClientStatus.Banned.toString()].includes(status);
  }

  public setClientStatus(status: ClientStatus): Result<string> {
    if (!Client.isStatusValid(status)) {
      const error = Result.fail<string>(STATUS_ERROR_MESSAGE);
      return error;
    }
    this.props.status = status;
    return Result.ok<string>('Client status changed successfully.');
  }

  public updateDetails(client: Omit<IClientProps, 'accountId' | 'status'>): Result<string> {
    const nameOrError = ClientName.create(client.name);
    const surnameOrError = ClientSurname.create(client.surname || null);
    const birthDayOrError = ClientBirthDay.create(client.birthDay || null);
    const emailOrError = ClientEmail.create(client.email || null);
    const phoneOrError = ClientPhoneNumber.create(client.phone || null);

    const bulkResult = Result.bulkCheck([nameOrError, surnameOrError, birthDayOrError, emailOrError, phoneOrError]);

    if (bulkResult.isFailure) {
      return Result.fail<string>(`Could not update Client. Error: ${bulkResult.error}`);
    }

    if (client.name !== undefined) {
      this.props.name = nameOrError.getValue();
    }
    if (client.surname !== undefined) {
      this.props.surname = surnameOrError.getValue();
    }
    if (client.phone !== undefined) {
      this.props.phone = phoneOrError.getValue();
    }
    if (client.birthDay !== undefined) {
      this.props.birthDay = birthDayOrError.getValue();
    }
    if (client.email !== undefined) {
      this.props.email = emailOrError.getValue();
    }

    return Result.ok<string>(bulkResult.getValue());
  }

  public static create(props: IClientProps, id?: UniqueEntityID): Result<Client> {
    const accountIdOrError = AccountId.create(new UniqueEntityID(props.accountId));
    const nameOrError = ClientName.create(props.name);
    const surnameOrError = ClientSurname.create(props.surname || null);
    const birthDayOrError = ClientBirthDay.create(props.birthDay || null);
    const emailOrError = ClientEmail.create(props.email || null);
    const phoneOrError = ClientPhoneNumber.create(props.phone || null);
    const status = props.status;

    const bulkResult = Result.bulkCheck([accountIdOrError, nameOrError, surnameOrError, birthDayOrError, emailOrError, phoneOrError]);

    if (bulkResult.isFailure) {
      return Result.fail<Client>(`Could not create Client. Error: ${bulkResult.error}`);
    }

    if (!Client.isStatusValid(status)) {
      return Result.fail<Client>(STATUS_ERROR_MESSAGE);
    }

    const client = new Client(
      {
        accountId: accountIdOrError.getValue(),
        name: nameOrError.getValue(),
        status: this.isStatusValid(status) ? (status as ClientStatus) : ClientStatus.Active,
        surname: surnameOrError.getValue(),
        birthDay: birthDayOrError.getValue(),
        email: emailOrError.getValue(),
        phone: phoneOrError.getValue(),
      },
      id,
    );
    return Result.ok<Client>(client);
  }
}
