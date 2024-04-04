import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetClientByIdQuery } from './GetClientByIdQuery';
import { ClientRepository } from '../../repos/Client.repository';
import { UniqueEntityID } from 'src/shared/UniqueId';
import { AccountId } from 'src/modules/account/domain/AccountId';
import { ClientId } from '../../domain/client/ClientId';

type ResponseResult = {
  id: string;
  name: string;
  surname: string;
  status: string;
  birthDay: string | null;
  phone: string | null;
  email: string | null;
};

@QueryHandler(GetClientByIdQuery)
export class GetClientByIdUseCase implements IQueryHandler<GetClientByIdQuery> {
  constructor(private readonly clientsRepository: ClientRepository) {}

  async execute(query: GetClientByIdQuery): Promise<ResponseResult> {
    const accountID = AccountId.create(new UniqueEntityID(query.accountId));
    const clientID = ClientId.create(new UniqueEntityID(query.clientId));

    const client = await this.clientsRepository.findClientById(clientID, accountID);

    return {
      id: client.id.value,
      name: client.name.value,
      surname: client.surname.value,
      status: client.status.value,
      birthDay: client.birthDay.value ? client.birthDay.value.toISOString() : null,
      email: client.email.value,
      phone: client.phone.value,
    };
  }
}
