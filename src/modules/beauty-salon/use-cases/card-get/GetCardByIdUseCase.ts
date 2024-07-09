import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCardByIdQuery } from './GetCardByIdQuery';
import { UniqueEntityID } from 'src/shared/UniqueId';
import { AccountId } from 'src/modules/account/domain/AccountId';
import { CardsRepository } from '../../repos/Cards.repository';
import { CardId } from '../../domain/card/CardId';

type ResponseResult = any;

@QueryHandler(GetCardByIdQuery)
export class GetCardByIdUseCase implements IQueryHandler<GetCardByIdQuery> {
  constructor(private readonly cardRepository: CardsRepository) {}

  async execute(query: GetCardByIdQuery): Promise<ResponseResult> {
    const accountID = AccountId.create(new UniqueEntityID(query.accountId));
    const cardID = CardId.create(new UniqueEntityID(query.cardId));

    const card = await this.cardRepository.findCardById(cardID, accountID);

    const template = {
      id: card.template.id.value,
      name: card.template.name,
      fields: card.template.fields,
    };

    return {
      id: card.id.value,
      clientId: card.clientId.value,
      appointmentId: card.appointmentId?.value,
      date: card.date.value,
      template: template,
    };
  }
}
