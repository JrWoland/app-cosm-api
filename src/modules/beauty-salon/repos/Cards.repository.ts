import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CardFilters, ICardsRepo } from '../domain/card/ICardsRepo';
import { AccountId } from 'src/modules/account/domain/AccountId';
import { Card } from '../domain/card/Card';
import { CardId } from '../domain/card/CardId';
import { InjectModel } from '@nestjs/mongoose';
import { CardModel } from 'src/db/mongoose/card.sheema';
import { FilterQuery, Model } from 'mongoose';
import { CardMap } from './mappers/CardMap';

@Injectable()
export class CardsRepository implements ICardsRepo {
  constructor(@InjectModel(CardModel.name) private model: Model<CardModel>) {}

  private buildQuery(accountId: AccountId, filters: CardFilters): FilterQuery<CardModel> {
    const mongooseQuery: FilterQuery<CardModel> = {
      account_id: accountId.value,
    };

    if (filters.clientId) mongooseQuery.client = filters.clientId;

    if (filters.appointmentId) mongooseQuery.appointment = filters.appointmentId;

    return mongooseQuery;
  }

  async count(accountId: AccountId, filters: CardFilters): Promise<number> {
    try {
      const numberOfCards = await this.model.countDocuments(this.buildQuery(accountId, filters));
      return numberOfCards;
    } catch (error) {
      throw new InternalServerErrorException(`Could not count cards: ${error}`);
    }
  }

  async findAllCards(accountId: AccountId, filters: CardFilters): Promise<{ count: number; cards: Card[] }> {
    try {
      const result = await this.model
        .find(this.buildQuery(accountId, filters))
        .limit(filters.limit * 1)
        .skip((filters.page - 1) * filters.limit)
        .sort({ date: 'desc' });

      const count = await this.count(accountId, filters);

      const cardsList = result.map((card) => new CardMap().toDomain(card));

      return { count, cards: cardsList };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  //   async findCardById(cardId: CardId, accountId: AccountId): Promise<Card> {
  //     throw new Error('Method not implemented.');
  //   }

  async exist(cardId: CardId, accountId: AccountId): Promise<boolean> {
    try {
      const doc = await this.model.exists({ _id: cardId.value.getValue(), account_id: accountId.value });
      return !!doc;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async save(card: Card): Promise<void> {
    try {
      const cardToSave = new CardMap().toPersistence(card);

      const exist = await this.exist(card.id, card.accountId);

      if (!exist) {
        const newCard = new this.model(cardToSave);
        await newCard.save();
      }

      await this.model.findOneAndUpdate(
        {
          _id: card.id.value.getValue(),
          account_id: card.accountId.value,
        },
        cardToSave,
      );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
