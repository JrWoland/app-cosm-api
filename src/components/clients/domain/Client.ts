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

interface ClientProps {
  accountId: AccountId;
  name: string;
  status: ClientStatus;
  surname?: string;
  birthDay?: Date;
  phone?: string;
  email?: string;
}

export class Client extends AggregateRoot<ClientProps> {
  private constructor(props: ClientProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get clientId(): ClientId {
    return ClientId.create(this._uniqueEntityId).getValue();
  }

  get accountId(): AccountId {
    return this.props.accountId;
  }

  get name() {
    return this.props.name;
  }

  get surname() {
    return this.props.surname;
  }

  get birthDay() {
    return this.props.birthDay;
  }

  get phone() {
    return this.props.phone;
  }

  get email() {
    return this.props.email;
  }

  get status() {
    return this.props.status;
  }

  private static isEmailValid(email: string | undefined): boolean {
    return mailRegex.test(email || '');
  }

  public setName(val: string): Result<string> {
    const hasName = !!val;
    if (!hasName) {
      const error = Result.fail<string>(NAME_ERROR_MESSAGE);
      this.registerError(error);
      return error;
    }
    this.props.name = val;
    return Result.ok('Name has been changed.');
  }

  public setClientStatus(status: ClientStatus): Result<string> {
    if (![ClientStatus.Active, ClientStatus.Archived, ClientStatus.Banned].includes(status)) {
      const error = Result.fail<string>('Invalid client status.');
      this.registerError(error);
      return error;
    }
    this.props.status = status;
    return Result.ok<string>('Client status changed successfully.');
  }

  public setSurname(val: string | undefined): Result<string> {
    this.props.surname = val;
    return Result.ok('Surname has been changed.');
  }

  public setBirthDay(val: Date | undefined): Result<string> {
    if (!dayjs(val).isValid()) {
      const error = Result.fail<string>(BIRTHDAY_ERROR_MESSAGE);
      this.registerError(error);
      return error;
    }
    this.props.birthDay = val;
    return Result.ok('Birth day has been changed.');
  }

  public setPhone(val: string | undefined): Result<string> {
    this.props.phone = val;
    return Result.ok('Phone number has been changed.');
  }

  public setEmail(val: string | undefined): Result<string> {
    if (!Client.isEmailValid(val)) {
      const error = Result.fail<string>(EMAIL_ERROR_MESSAGE);
      this.registerError(error);
      return error;
    }
    this.props.phone = val;
    return Result.ok('Email has been changed.');
  }

  public static create(props: ClientProps, id?: UniqueEntityID): Result<Client> {
    if (!props.name) {
      return Result.fail<Client>(NAME_ERROR_MESSAGE);
    }

    if (props.email && !Client.isEmailValid(props.email)) {
      return Result.fail<Client>(EMAIL_ERROR_MESSAGE);
    }

    if (props.birthDay && !dayjs(props.birthDay).isValid()) {
      return Result.fail<Client>(BIRTHDAY_ERROR_MESSAGE);
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
