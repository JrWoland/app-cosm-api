import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DeleteCardByIdQuery } from './DeleteCardByIdQuery';
import { UniqueEntityID } from 'src/shared/UniqueId';
import { AccountId } from 'src/modules/account/domain/AccountId';
import { CardsRepository } from '../../repos/Cards.repository';
import { CardId } from '../../domain/card/CardId';

type ResponseResult = {
  id: string;
  message: string;
  success: boolean;
};

@QueryHandler(DeleteCardByIdQuery)
export class DeleteCardByIdUseCase implements IQueryHandler<DeleteCardByIdQuery> {
  constructor(private readonly cardRepository: CardsRepository) {}

  public async execute(query: DeleteCardByIdQuery): Promise<ResponseResult> {
    const accountID = AccountId.create(new UniqueEntityID(query.accountId));
    const cardID = CardId.create(new UniqueEntityID(query.cardId));

    const result = await this.cardRepository.deleteOne(cardID, accountID);

    return {
      id: result.id,
      message: result.message,
      success: result.success,
    };
  }
}
