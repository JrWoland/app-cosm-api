import { Model } from 'mongoose';
import { ClientDocModel } from '../../../infra/db/models/clientModel';
import { AccountId } from '../../accounts/domain/AccountId';
import { Client } from '../domain/Client';
import { ClientId } from '../domain/ClientId';
import { ClientMap } from './mappers/ClientMap';

interface ClientFilters {
  page: number;
  limit: number;
  client?: string;
  status?: string;
}
export interface IClientRepo {
  count(accountId: AccountId, filters: ClientFilters): Promise<number>;
  findAllClients(accountId: AccountId, filters: ClientFilters): Promise<{ count: number; clients: Client[] }>;
  findClientById(clientId: ClientId, accountId: AccountId): Promise<Client>;
  exist(client: Client): Promise<boolean>;
  save(client: Client): Promise<void>;
}

export class ClientRepo implements IClientRepo {
  constructor(private model: Model<ClientDocModel>) {}

  private buildQuery(accountId: AccountId, filters: ClientFilters) {
    return {
      account_id: accountId.id.getValue(),
      $or: [{ name: new RegExp(filters.client || '', 'i') }, { surname: new RegExp(filters.client || '', 'i') }],
      status: {
        $regex: filters.status ? new RegExp(filters.status || '', 'i') : '',
      },
    };
  }

  public async count(accountId: AccountId, filters: ClientFilters): Promise<number> {
    try {
      const numberOfClients = await this.model.count(this.buildQuery(accountId, filters));
      return numberOfClients;
    } catch (error) {
      throw new Error(`Could not count clients: ${error}`);
    }
  }

  public async findClientById(clientId: ClientId, accountId: AccountId): Promise<Client> {
    try {
      const client = await this.model.find({
        _id: clientId.value,
        account_id: accountId.id.getValue(),
      });

      if (client.length === 0) {
        throw new Error('Client does not exists.');
      }
      return new ClientMap().toDomain(client[0]);
    } catch (error) {
      throw new Error(`Cant find client by id: ${error.message}`);
    }
  }

  public async findAllClients(accountId: AccountId, filters: ClientFilters): Promise<{ count: number; clients: Client[] }> {
    try {
      const result = await this.model
        .find(this.buildQuery(accountId, filters))
        .limit(filters.limit * 1)
        .skip((filters.page - 1) * filters.limit)
        .sort({ surname: 'asc' });

      const count = await this.count(accountId, filters);
      const clientsList = result.map((client) => new ClientMap().toDomain(client));

      return { clients: clientsList, count };
    } catch (error) {
      throw new Error(`Can not find clients: ${error}`);
    }
  }

  public async exist(client: Client): Promise<boolean> {
    try {
      const clientExists = await this.model.exists({
        _id: client.clientId.value,
        account_id: client.accountId.id.getValue(),
      });
      return clientExists;
    } catch (error) {
      throw new Error(`Can not check if client exists: ${error}`);
    }
  }

  public async save(client: Client): Promise<void> {
    try {
      const clientToSave = new ClientMap().toPersistence(client);

      const exists = await this.exist(client);

      if (!exists) {
        const newClient = new this.model(clientToSave);
        await newClient.save();
        return;
      }

      await this.model.findOneAndUpdate(
        {
          _id: client.clientId.value,
          account_id: client.accountId.id.getValue(),
        },
        clientToSave,
      );
    } catch (error) {
      throw new Error(`Can not save client: ${error}`);
    }
  }
}
