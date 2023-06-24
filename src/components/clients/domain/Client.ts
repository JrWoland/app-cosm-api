import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../../core/domain/UniqueId';
import { Result } from '../../../core/logic/Result';
import { AccountId } from '../../accounts/domain/AccountId';
import { ClientId } from './ClientId';
import { ClientStatus } from './ClientStatus';
import { mailRegex } from '../../../core/utils/mailRegex';
import dayjs from 'dayjs';

const EMAIL_ERROR_MESSAGE = 'Email structure is invalid.';
const NAME_ERROR_MESSAGE = 'Client need to have name.';
const BIRTHDAY_ERROR_MESSAGE = 'Birth day format is not valid.';
const STATUS_ERROR_MESSAGE = 'Invalid client status.';

interface ClientProps {
  accountId: AccountId;
  name: string;
  status: ClientStatus;
  surname: string | null;
  birthDay: Date | null;
  phone: string | null;
  email: string | null;
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

  private static isEmailValid(email: string): boolean {
    return mailRegex.test(email);
  }

  private setName(val: string): Result<string> {
    const hasName = !!val;
    if (!hasName) {
      const error = Result.fail<string>(NAME_ERROR_MESSAGE);
      return error;
    }
    this.props.name = val;
    return Result.ok('Name has been changed.');
  }

  private setSurname(val: string | null): Result<string> {
    this.props.surname = val;
    return Result.ok('Surname has been changed.');
  }

  private setBirthDay(val: Date | null): Result<string> {
    if (val === null) {
      this.props.birthDay = val;
      return Result.ok('Birth day has been changed.');
    }

    if (!dayjs(val).isValid()) {
      const error = Result.fail<string>(BIRTHDAY_ERROR_MESSAGE);
      return error;
    }
    this.props.birthDay = val;
    return Result.ok('Birth day has been changed.');
  }

  private setPhone(val: string | null): Result<string> {
    this.props.phone = val;
    return Result.ok('Phone number has been changed.');
  }

  private setEmail(val: string | null): Result<string> {
    const EMAIL_CHANGED_MESSAGE = 'Email has been changed.';
    if (val) {
      if (!Client.isEmailValid(val)) {
        const error = Result.fail<string>(EMAIL_ERROR_MESSAGE);
        return error;
      }
      this.props.email = val;
    }

    return Result.ok(EMAIL_CHANGED_MESSAGE);
  }

  private static isStatusValid(status: ClientStatus): boolean {
    return [ClientStatus.Active, ClientStatus.Archived, ClientStatus.Banned].includes(status);
  }

  public setClientStatus(status: ClientStatus): Result<string> {
    if (!Client.isStatusValid(status)) {
      const error = Result.fail<string>(STATUS_ERROR_MESSAGE);
      return error;
    }
    this.props.status = status;
    return Result.ok<string>('Client status changed successfully.');
  }

  public updateDetails(client: Omit<ClientProps, 'accountId' | 'status'>): Result<string> {
    const results: Result<string>[] = [];

    if (client.name !== undefined) {
      results.push(this.setName(client.name));
    }
    if (client.surname !== undefined) {
      results.push(this.setSurname(client.surname));
    }
    if (client.phone !== undefined) {
      results.push(this.setPhone(client.phone));
    }
    if (client.birthDay !== undefined) {
      results.push(this.setBirthDay(client.birthDay));
    }
    if (client.email !== undefined) {
      results.push(this.setEmail(client.email));
    }

    const bulkResult = Result.bulkCheck<string>(results);

    if (bulkResult.isFailure) {
      return Result.fail(bulkResult.error);
    }

    return Result.ok(bulkResult.getValue());
  }

  public static create(props: ClientProps, id?: UniqueEntityID): Result<Client> {
    if (!props.name) {
      return Result.fail<Client>(NAME_ERROR_MESSAGE);
    }

    if (props.email && !Client.isEmailValid(props.email)) {
      return Result.fail<Client>(EMAIL_ERROR_MESSAGE);
    }

    if (props.birthDay && !dayjs(props.birthDay).isValid()) {
      console.log(props, '@@@@@@@@@@@@@@@@@@@@@@');
      return Result.fail<Client>(BIRTHDAY_ERROR_MESSAGE);
    }

    if (props.status && !Client.isStatusValid(props.status)) {
      return Result.fail<Client>(STATUS_ERROR_MESSAGE);
    }

    const client = new Client(
      {
        accountId: props.accountId,
        name: props.name,
        status: props.status,
        surname: props.surname,
        birthDay: props.birthDay,
        email: props.email,
        phone: props.phone,
      },
      id,
    );

    return Result.ok<Client>(client);
  }
}
