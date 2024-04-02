import { Mapper } from 'src/shared/Mapper';
import { Client } from '../../domain/client/Client';
import { ClientModel } from 'src/db/mongoose/client.sheema';
import { AccountId } from 'src/modules/account/domain/AccountId';
import { UniqueEntityID } from 'src/shared/UniqueId';
import { ClientId } from '../../domain/client/ClientId';
import { ClientName } from '../../domain/client/ClientName';
import { ClientSurname } from '../../domain/client/ClientSurname';
import { ClientStatus } from '../../domain/client/ClientStatus';
import { ClientBirthDay } from '../../domain/client/ClientBirthDay';
import { ClientEmail } from '../../domain/client/ClientEmail';
import { ClientPhoneNumber } from '../../domain/client/ClientPhone';

export class ClientMap implements Mapper<Client, ClientModel> {
  toPersistence(client: Client): ClientModel {
    return {
      _id: client.id.value,
      account_id: client.accountId.value,
      name: client.name.value,
      status: client.status.value,
      surname: client.surname.value,
      birth_day: client.birthDay.value || null,
      email: client.email.value || null,
      phone: client.phone.value || null,
    };
  }

  toDomain(raw: ClientModel): Client {
    const accountId = AccountId.create(new UniqueEntityID(raw.account_id));
    const clientId = ClientId.create(new UniqueEntityID(raw._id));
    const clientName = ClientName.create(raw.name);
    const clientSurname = ClientSurname.create(raw.surname);
    const clientStatus = ClientStatus.create(raw.status);
    const clientBirth = ClientBirthDay.create(raw.birth_day?.toString() || null);
    const clientEmail = ClientEmail.create(raw.email);
    const clientPhone = ClientPhoneNumber.create(raw.phone);

    const client = Client.create({
      id: clientId,
      accountId: accountId,
      name: clientName,
      surname: clientSurname,
      status: clientStatus,
      birthDay: clientBirth,
      email: clientEmail,
      phone: clientPhone,
    });

    return client;
  }
}
