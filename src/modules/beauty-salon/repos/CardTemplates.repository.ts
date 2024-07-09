import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { AccountId } from 'src/modules/account/domain/AccountId';
import { CardTemplate } from '../domain/card/CardTemplate';
import { CardTemplateId } from '../domain/card/CardTemplateId';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CardTemplateModel } from 'src/db/mongoose/cardTemplate.sheema';
import { CardTemplateFilters, ICardTemplatesRepo } from '../domain/card/ICardTemplatesRepo';
import { CardTemplateMap } from './mappers/CardTemplateMap';

@Injectable()
export class CardTemplatesRepository implements ICardTemplatesRepo {
  constructor(@InjectModel(CardTemplateModel.name) private model: Model<CardTemplateModel>) {}

  private buildQuery(accountId: AccountId, filters: CardTemplateFilters): FilterQuery<CardTemplateModel> {
    const mongooseQuery: FilterQuery<CardTemplateModel> = {
      account_id: accountId.value,
    };

    if (filters.name) mongooseQuery.client = filters.name;

    return mongooseQuery;
  }

  async count(accountId: AccountId, filters: CardTemplateFilters): Promise<number> {
    try {
      const numberOfCards = await this.model.countDocuments(this.buildQuery(accountId, filters));
      return numberOfCards;
    } catch (error) {
      throw new InternalServerErrorException(`Could not count card templates: ${error}`);
    }
  }

  async findAllCardTemplates(accountId: AccountId, filters: CardTemplateFilters): Promise<{ count: number; cardTemplates: CardTemplate[] }> {
    try {
      const result = await this.model
        .find(this.buildQuery(accountId, filters))
        .limit(filters.limit * 1)
        .skip((filters.page - 1) * filters.limit)
        .sort({ date: 'desc' });

      const count = await this.count(accountId, filters);

      const cardTemplatesList = result.map((card) => new CardTemplateMap().toDomain(card));

      return { count, cardTemplates: cardTemplatesList };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findCardTemplateById(cardId: CardTemplateId, accountId: AccountId): Promise<CardTemplate> {
    try {
      const card = await this.model.find({
        _id: cardId.value,
        account_id: accountId.value,
      });

      if (card.length === 0) {
        throw new NotFoundException(`Card template does not exist. id: ${cardId.value}`);
      }

      return new CardTemplateMap().toDomain(card[0]);
    } catch (error) {
      throw new InternalServerErrorException(`Cant find card template by id: ${error}`);
    }
  }

  async exist(cardId: CardTemplateId, accountId: AccountId): Promise<boolean> {
    try {
      const doc = await this.model.exists({ _id: cardId.value, account_id: accountId.value });
      return !!doc;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async save(card: CardTemplate): Promise<void> {
    try {
      const cardToSave = new CardTemplateMap().toPersistence(card);

      const exist = await this.exist(card.id, card.accountId);

      if (!exist) {
        const newCard = new this.model(cardToSave);
        await newCard.save();
      }

      await this.model.findOneAndUpdate(
        {
          _id: card.id.value,
          account_id: card.accountId.value,
        },
        cardToSave,
      );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
