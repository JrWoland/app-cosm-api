import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EditClientDetailsCommand } from './EditClientDetailsCommand';
import { AccountId } from 'src/modules/account/domain/AccountId';
import { UniqueEntityID } from 'src/shared/UniqueId';
import { UnprocessableEntityException } from '@nestjs/common';
import { ClientRepository } from '../../repos/Client.repository';
import { ClientId } from '../../domain/client/ClientId';
import { ClientName } from '../../domain/client/ClientName';
import { ClientSurname } from '../../domain/client/ClientSurname';
import { ClientBirthDay } from '../../domain/client/ClientBirthDay';
import { ClientEmail } from '../../domain/client/ClientEmail';
import { ClientPhoneNumber } from '../../domain/client/ClientPhone';

@CommandHandler(EditClientDetailsCommand)
export class EditClientDetailsUseCase implements ICommandHandler<EditClientDetailsCommand> {
  constructor(private readonly clientRepository: ClientRepository) {}

  async execute(command: EditClientDetailsCommand) {
    const { accountId, clientId, name, surname, birthDay, email, phone } = command;

    if (!accountId) {
      throw new UnprocessableEntityException('Missing account id.');
    }

    const acocuntID = AccountId.create(new UniqueEntityID(accountId));
    const clientID = ClientId.create(new UniqueEntityID(clientId));

    const client = await this.clientRepository.findClientById(clientID, acocuntID);

    client.updateDetails({
      name: ClientName.create(name),
      surname: ClientSurname.create(surname),
      birthDay: ClientBirthDay.create(birthDay),
      email: ClientEmail.create(email),
      phone: ClientPhoneNumber.create(phone),
    });

    await this.clientRepository.save(client);
  }
}
