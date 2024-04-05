import { AccountId } from 'src/modules/account/domain/AccountId';
import { Client } from './Client';
import { ClientId } from './ClientId';

export interface ClientFilters {
  page: number;
  limit: number;
  client?: string;
  status?: string;
}
export interface IClientRepo {
  count(accountId: AccountId, filters: ClientFilters): Promise<number>;
  findAllClients(accountId: AccountId, filters: ClientFilters): Promise<{ count: number; clients: Client[] }>;
  findClientById(clientId: ClientId, accountId: AccountId): Promise<Client>;
  exist(clientId: ClientId, accountId: AccountId): Promise<boolean>;
  save(client: Client): Promise<void>;
}
