import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ArchiveClientCommand } from './ArchiveClientCommand';
import { AccountId } from 'src/modules/account/domain/AccountId';
import { UniqueEntityID } from 'src/shared/UniqueId';
import { ClientRepository } from '../../repos/Client.repository';
import { ClientId } from '../../domain/client/ClientId';

type Result = { message: string; id: string; success: boolean };

@CommandHandler(ArchiveClientCommand)
export class ArchiveClientUseCase implements ICommandHandler<ArchiveClientCommand, Result> {
  constructor(private readonly clientsRepository: ClientRepository) {}

  async execute(command: ArchiveClientCommand): Promise<{ message: string; id: string; success: boolean }> {
    const { accountId, clientId } = command;

    const accountID = AccountId.create(new UniqueEntityID(accountId));
    const clientID = ClientId.create(new UniqueEntityID(clientId));

    const client = await this.clientsRepository.findClientById(clientID, accountID);

    client.archive();

    try {
      await this.clientsRepository.save(client);
      return { id: clientID.value, message: 'Client archived.', success: true };
    } catch (error) {
      return { id: clientID.value, message: 'Could not archive client', success: false };
    }
  }
}
