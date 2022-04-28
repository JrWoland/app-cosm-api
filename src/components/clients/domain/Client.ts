import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../../core/domain/UniqueId';
import { Result } from '../../../core/logic/Result';
import { AccountId } from '../../accounts/domain/AccountId';
import { ClientId } from './ClientId';

interface ClientProps {
  accountId: AccountId;
  name: string;
  surname: string;
  age?: number;
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

  public static create(props: ClientProps, id?: UniqueEntityID): Result<Client> {
    const hasName = !!props.name;

    if (!hasName) {
      return Result.fail<Client>('Client need to pass at least name.');
    }

    const client = new Client(
      {
        accountId: props.accountId,
        name: props.name,
        surname: props.surname,
        age: props.age,
        email: props.email,
        phone: props.phone,
      },
      id,
    );

    return Result.ok<Client>(client);
  }
}
