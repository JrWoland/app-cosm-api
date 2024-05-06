import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ClientFilters, IClientRepo } from '../domain/client/IClientRepo';
import { AccountId } from 'src/modules/account/domain/AccountId';
import { Client } from '../domain/client/Client';
import { ClientId } from '../domain/client/ClientId';
import { InjectModel } from '@nestjs/mongoose';
import { ClientModel } from 'src/db/mongoose/client.sheema';
import { FilterQuery, Model } from 'mongoose';
import { ClientMap } from './mappers/ClientMap';

@Injectable()
export class ClientRepository implements IClientRepo {
  constructor(@InjectModel(ClientModel.name) private model: Model<ClientModel>) {}

  private buildQuery(accountId: AccountId, filters: ClientFilters): FilterQuery<ClientModel> {
    return {
      account_id: accountId.value,
      $or: [{ name: new RegExp(filters.client || '', 'i') }, { surname: new RegExp(filters.client || '', 'i') }],
      status: {
        $regex: filters.status ? new RegExp(filters.status || '', 'i') : '',
      },
    };
  }

  public async count(accountId: AccountId, filters: ClientFilters): Promise<number> {
    try {
      const numberOfClients = await this.model.countDocuments(this.buildQuery(accountId, filters));
      return numberOfClients;
    } catch (error) {
      throw new InternalServerErrorException(`Could not count clients: ${error}`);
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
      throw new InternalServerErrorException(`Can not find clients: ${error}`);
    }
  }

  public async findClientById(clientId: ClientId, accountId: AccountId): Promise<Client> {
    try {
      const client = await this.model.find({
        _id: clientId.value,
        account_id: accountId.value,
      });

      if (client.length === 0) {
        throw new NotFoundException(`Client does not exist. id: ${clientId.value}`);
      }

      return new ClientMap().toDomain(client[0]);
    } catch (error) {
      throw new InternalServerErrorException(`Cant find client by id: ${error}`);
    }
  }

  public async exist(clientId: ClientId, accountId: AccountId): Promise<boolean> {
    try {
      const clientExists = await this.model.exists({
        _id: clientId.value,
        account_id: accountId.value,
      });
      return !!clientExists;
    } catch (error) {
      throw new InternalServerErrorException(`Can not check if client exists: ${error}`);
    }
  }

  public async save(client: Client): Promise<void> {
    try {
      const clientToSave = new ClientMap().toPersistence(client);

      const exists = await this.exist(client.id, client.accountId);

      if (!exists) {
        const newClient = new this.model(clientToSave);
        await newClient.save();
        return;
      }

      await this.model.findOneAndUpdate(
        {
          _id: client.id.value,
          account_id: client.accountId.value,
        },
        clientToSave,
      );
    } catch (error) {
      throw new Error(`Can not save client: ${error}`);
    }
  }
}
