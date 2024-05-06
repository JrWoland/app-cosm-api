import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCardCommand } from './CreateCardCommand';
import { Card } from '../../domain/card/Card';
import { AccountId } from 'src/modules/account/domain/AccountId';
import { UniqueEntityID } from 'src/shared/UniqueId';
import { ClientId } from '../../domain/client/ClientId';
import { CardId } from '../../domain/card/CardId';
import { AppointmentId } from '../../domain/appointment/AppointmentId';
import { CardDate } from '../../domain/card/CardDate';
import { CardTemplate } from '../../domain/card/CardTemplate';
import { lashesTemplate } from '../../domain/card/defaultTemplates/LashesTemplate';
import { CardsRepository } from '../../repos/Cards.repository';
import { randomUUID } from 'crypto';
import { ClientRepository } from '../../repos/Client.repository';
import { UnprocessableEntityException } from '@nestjs/common';

@CommandHandler(CreateCardCommand)
export class CreateCardUseCase implements ICommandHandler<CreateCardCommand> {
  constructor(
    private cardRepository: CardsRepository,
    private clientRepository: ClientRepository,
  ) {}

  async execute(command: CreateCardCommand): Promise<{ message: string; id: string; success: boolean }> {
    const { accountId, appointmentId, clientId, date } = command;

    const accountID = AccountId.create(new UniqueEntityID(accountId));
    const clientID = ClientId.create(new UniqueEntityID(clientId));
    const appointmentID = appointmentId ? AppointmentId.create(new UniqueEntityID(appointmentId)) : null;

    const fields = lashesTemplate;

    const clientExists = await this.clientRepository.exist(clientID, accountID);

    if (!clientExists) {
      throw new UnprocessableEntityException(`Client not found ID: ${clientID.value}`);
    }

    const cardTemplate = CardTemplate.create(
      {
        accountId: accountID,
        name: 'Rzęsy',
        fields: fields,
      },
      new UniqueEntityID(randomUUID()),
    );

    const card = Card.create({
      id: CardId.create(new UniqueEntityID()),
      accountId: accountID,
      clientId: clientID,
      appointmentId: appointmentID,
      date: CardDate.create(date),
      template: cardTemplate,
    });

    await this.cardRepository.save(card);

    return { id: card.id.value.getValue(), message: 'Success', success: true };
  }
}
