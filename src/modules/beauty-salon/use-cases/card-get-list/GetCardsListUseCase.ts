import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCardsListQuery } from './GetCardsListQuery';
import { UniqueEntityID } from 'src/shared/UniqueId';
import { AccountId } from 'src/modules/account/domain/AccountId';
import { CardsRepository } from '../../repos/Cards.repository';

type CardResponse = {
  id: string;
  appointmentId: string | null;
  clientId: string;
  date: string;
  template: {
    id: string;
    name: string;
  };
};

type ResponseResult = {
  count: number;
  limit: number;
  page: number;
  cards: CardResponse[];
};

@QueryHandler(GetCardsListQuery)
export class GetCardsListUseCase implements IQueryHandler<GetCardsListQuery> {
  constructor(private readonly cardRepository: CardsRepository) {}

  async execute(query: GetCardsListQuery): Promise<ResponseResult> {
    const accountID = AccountId.create(new UniqueEntityID(query.accountId));

    const { clientId = '', limit = 10, page = 1 } = query;

    const { count, cards } = await this.cardRepository.findAllCards(accountID, { clientId, limit, page });

    const cardsList: CardResponse[] = cards.map((item) => ({
      id: item.id.value,
      appointmentId: item.appointmentId?.value || null,
      clientId: item.clientId.value,
      date: item.date.value.toISOString(),
      template: {
        id: item.template.id.value,
        name: item.template.name,
      },
    }));

    return {
      page,
      limit,
      count: count,
      cards: cardsList,
    };
  }
}
