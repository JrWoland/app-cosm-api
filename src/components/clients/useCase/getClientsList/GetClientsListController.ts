import { UniqueEntityID } from '../../../../core/domain/UniqueId';
import { BaseController } from '../../../../core/infra/BaseController';
import { DecodedExpressReq } from '../../../../infra/server/api/DecodedExpressReq';
import { AccountId } from '../../../accounts/domain/AccountId';
import { ClientRepository } from '../../repo';

interface ResponseClientDTO {
  id: string;
  name: string;
  surname: string | null;
  birthDate: Date | null;
  phone: string | null;
  email: string | null;
  status: string;
}

interface ClientsResponse {
  count: number;
  totalPages: number;
  currentPage: number;
  clients: ResponseClientDTO[];
}

export class GetClientByClientsListController extends BaseController {
  public async executeImpl(req: DecodedExpressReq): Promise<unknown> {
    try {
      const accId = AccountId.create(new UniqueEntityID(req.accountId));

      const { page = 1, limit = 10, status, client } = req.query;

      const queryFilters = {
        page: Number(page || 1),
        limit: Number(limit || 10),
        client: String(client || ''),
        status: String(status || '').toUpperCase(),
      };

      const { clients, count } = await ClientRepository.findAllClients(accId.getValue(), queryFilters);

      const clientsList: ResponseClientDTO[] = clients.map((client) => ({
        id: client.clientId.value,
        name: client.name.value,
        surname: client.surname.value || null,
        birthDate: new Date(client.birthDay.value || ''),
        phone: client.phone.value || null,
        email: client.email.value || null,
        status: client.status,
      }));

      return this.ok<ClientsResponse>(this.res, {
        count,
        totalPages: Math.ceil(count / Number(limit)),
        currentPage: Number(page),
        clients: clientsList || [],
      });
    } catch (error) {
      return this.fail(error.message);
    }
  }
}
