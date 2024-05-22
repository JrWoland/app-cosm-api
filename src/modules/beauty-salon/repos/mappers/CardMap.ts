import { Mapper } from 'src/shared/Mapper';
import { Card } from '../../domain/card/Card';
import { CardModel } from 'src/db/mongoose/card.sheema';
import { CardId } from '../../domain/card/CardId';
import { AccountId } from 'src/modules/account/domain/AccountId';
import { AppointmentId } from '../../domain/appointment/AppointmentId';
import { ClientId } from '../../domain/client/ClientId';
import { CardDate } from '../../domain/card/CardDate';
import { CardTemplate } from '../../domain/card/CardTemplate';
import { UniqueEntityID } from 'src/shared/UniqueId';

export class CardMap implements Mapper<Card, CardModel> {
  toPersistence(card: Card): CardModel {
    const template = {
      _id: card.template.id.getValue(),
      account_id: card.template.accountId.value,
      name: card.template.name,
      fields: card.template.fields,
    };

    return {
      _id: card.id.value,
      account_id: card.accountId.value,
      appointment: card.appointmentId?.value || null,
      client: card.clientId.value,
      date: card.date.value,
      template: template,
    };
  }

  toDomain(card: CardModel): Card {
    const template = CardTemplate.create(
      {
        accountId: AccountId.create(new UniqueEntityID(card.account_id)),
        name: card?.template?.name,
        fields: card?.template?.fields.map((item) => ({
          description: item.description,
          identifier: item.identifier,
          label: item.label,
          optionalValues: item.optionalValues,
          value: item.value,
        })),
      },
      new UniqueEntityID(card.template._id),
    );

    const result = Card.create({
      id: CardId.create(new UniqueEntityID(card._id)),
      accountId: AccountId.create(new UniqueEntityID(card.account_id)),
      appointmentId: card.appointment ? AppointmentId.create(new UniqueEntityID(card.appointment)) : null,
      clientId: ClientId.create(new UniqueEntityID(card.client)),
      date: CardDate.create(card.date.toString()),
      template: template,
    });

    return result;
  }
}
