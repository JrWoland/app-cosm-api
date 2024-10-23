import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ActivateClientCommand } from './ActivateClientCommand';
import { AccountId } from 'src/modules/account/domain/AccountId';
import { UniqueEntityID } from 'src/shared/UniqueId';
import { ClientRepository } from '../../repos/Client.repository';
import { ClientId } from '../../domain/client/ClientId';

type Result = { message: string; id: string; success: boolean };

@CommandHandler(ActivateClientCommand)
export class ActivateClientUseCase implements ICommandHandler<ActivateClientCommand, Result> {
  constructor(private readonly clientsRepository: ClientRepository) {}

  async execute(command: ActivateClientCommand): Promise<{ message: string; id: string; success: boolean }> {
    const { accountId, clientId } = command;

    const accountID = AccountId.create(new UniqueEntityID(accountId));
    const clientID = ClientId.create(new UniqueEntityID(clientId));

    const client = await this.clientsRepository.findClientById(clientID, accountID);

    if (!client) {
      return { id: clientID.value, message: 'Client not found', success: false };
    }

    client.activate();

    try {
      await this.clientsRepository.save(client);
      return { id: clientID.value, message: 'Client Activated.', success: true };
    } catch (error) {
      return { id: clientID.value, message: 'Could not Activate client', success: false };
    }
  }
}
