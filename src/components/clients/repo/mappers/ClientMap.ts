import { Mapper } from '../../../../core/infra/Mapper';
import { Client } from '../../domain/Client';
import { ClientDocModel } from '../../../../infra/db/models/clientModel';
import { AccountId } from '../../../accounts/domain/AccountId';
import { UniqueEntityID } from '../../../../core/domain/UniqueId';

export class ClientMap implements Mapper<Client, ClientDocModel> {
  toPersistence(client: Client): ClientDocModel {
    return {
      _id: client.clientId.value,
      account_id: client.props.accountId.id.getValue(),
      name: client.props.name,
      status: client.props.status,
      surname: client.props.surname,
      birth_day: client.props.birthDay,
      email: client.props.email,
      phone: client.props.phone,
    };
  }
  toDomain(raw: ClientDocModel): Client {
    const accountId = AccountId.create(new UniqueEntityID(raw.account_id));

    const client = Client.create(
      {
        accountId: accountId.getValue(),
        name: raw.name,
        surname: raw.surname,
        status: raw.status,
        birthDay: raw.birth_day,
        email: raw.email,
        phone: raw.phone,
      },
      new UniqueEntityID(raw._id),
    );

    return client.getValue();
  }
}
