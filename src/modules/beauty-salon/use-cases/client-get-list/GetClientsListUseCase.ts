import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetClientsListQuery } from './GetClientsListQuery';
import { ClientRepository } from '../../repos/Client.repository';
import { UniqueEntityID } from 'src/shared/UniqueId';
import { AccountId } from 'src/modules/account/domain/AccountId';

type ClientsList = {
  id: string;
  name: string;
  surname: string;
  status: string;
  birthDay: string | null;
  phone: string | null;
  email: string | null;
}[];

type ResponseResult = {
  count: number;
  limit: number;
  page: number;
  clients: ClientsList;
};

@QueryHandler(GetClientsListQuery)
export class GetClientsListUseCase implements IQueryHandler<GetClientsListQuery> {
  constructor(private readonly clientsRepository: ClientRepository) {}

  async execute(query: GetClientsListQuery): Promise<ResponseResult> {
    const accountId = AccountId.create(new UniqueEntityID(query.accountId));

    const { fullName, limit, page, status } = query;

    const { clients, count } = await this.clientsRepository.findAllClients(accountId, {
      limit,
      page,
      client: fullName,
      status: status,
    });

    const clienstResult: ClientsList = clients.map((client) => ({
      id: client.id.value,
      name: client.name.value,
      surname: client.surname.value,
      email: client.email.value,
      birthDay: client.birthDay.value ? client.birthDay.value?.toISOString() : null,
      phone: client.phone.value,
      status: client.status.value,
    }));

    return {
      count,
      limit,
      page,
      clients: clienstResult,
    };
  }
}
