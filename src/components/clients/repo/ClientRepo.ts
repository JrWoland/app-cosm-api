import { Model } from 'mongoose';
import { ClientDocModel } from '../../../infra/db/models/clientModel';
import { AccountId } from '../../accounts/domain/AccountId';
import { Client } from '../domain/Client';
import { ClientId } from '../domain/ClientId';
import { ClientMap } from './mappers/ClientMap';

export interface IClientRepo {
  findClientById(clientId: ClientId, accountId: AccountId): Promise<Client>;
  exist(client: Client): Promise<boolean>;
  save(client: Client): Promise<void>;
}

export class ClientRepo implements IClientRepo {
  constructor(private model: Model<ClientDocModel>) {}

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
      throw new Error(`Cant find client by id: ${error}`);
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
