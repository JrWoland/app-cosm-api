import { Model } from 'mongoose';
import { ClientDocModel } from '../../../infra/db/models/clientModel';
import { Client } from '../domain/Client';
import { ClientId } from '../domain/ClientId';
import { ClientMap } from './mappers/ClientMap';

export interface IClientRepo {
  findClientById(clientId: ClientId): Promise<Client>;
  exist(clientId: ClientId): Promise<boolean>;
  save(clientId: Client): Promise<void>;
}

export class ClientRepo implements IClientRepo {
  constructor(private model: Model<ClientDocModel>) {}

  public async findClientById(clientId: ClientId): Promise<Client> {
    try {
      const client = await this.model.find({ _id: clientId.value });

      if (client.length === 0) {
        throw new Error('Client does not exists.');
      }
      return new ClientMap().toDomain(client[0]);
    } catch (error: any) {
      throw new Error(`Cant find client by id: ${error}`);
    }
  }
  public async exist(clientId: ClientId): Promise<boolean> {
    try {
      const clientExists = await this.model.exists({ _id: clientId.value });
      return clientExists;
    } catch (error: any) {
      throw new Error(`Can not check if client exists: ${error}`);
    }
  }
  public async save(client: Client): Promise<void> {
    try {
      const clientToSave = new ClientMap().toPersistence(client);

      const exists = this.exist(client.clientId);

      if (!exists) {
        const newClient = new this.model(clientToSave);
        await newClient.save();
        return;
      }

      await this.model.findOneAndUpdate(
        {
          _id: client.clientId.value,
        },
        clientToSave,
      );
    } catch (error: any) {
      throw new Error(`Can not save client: ${error}`);
    }
  }
}
