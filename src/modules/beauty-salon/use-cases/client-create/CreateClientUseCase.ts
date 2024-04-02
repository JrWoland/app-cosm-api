import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateClientCommand } from './CreateClientCommand';
import { AccountId } from 'src/modules/account/domain/AccountId';
import { UniqueEntityID } from 'src/shared/UniqueId';
import { UnprocessableEntityException } from '@nestjs/common';
import { Client } from '../../domain/client/Client';
import { ClientRepository } from '../../repos/Client.repository';
import { ClientId } from '../../domain/client/ClientId';
import { ClientName } from '../../domain/client/ClientName';
import { ClientSurname } from '../../domain/client/ClientSurname';
import { ClientStatus } from '../../domain/client/ClientStatus';
import { ClientBirthDay } from '../../domain/client/ClientBirthDay';
import { ClientEmail } from '../../domain/client/ClientEmail';
import { ClientPhoneNumber } from '../../domain/client/ClientPhone';

@CommandHandler(CreateClientCommand)
export class CreateClientUseCase implements ICommandHandler<CreateClientCommand> {
  constructor(private readonly clientRepository: ClientRepository) {}

  async execute(command: CreateClientCommand) {
    const { accountId, name, surname, birthDay, email, phone } = command;

    if (!accountId) {
      throw new UnprocessableEntityException('Missing account id.');
    }

    const client = Client.create({
      id: ClientId.create(new UniqueEntityID()),
      accountId: AccountId.create(new UniqueEntityID(accountId)),
      name: ClientName.create(name),
      surname: ClientSurname.create(surname),
      status: ClientStatus.create('ACTIVE'),
      birthDay: ClientBirthDay.create(birthDay || null),
      email: ClientEmail.create(email || null),
      phone: ClientPhoneNumber.create(phone || null),
    });

    await this.clientRepository.save(client);
  }
}
