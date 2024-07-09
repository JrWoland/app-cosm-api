import { AccountId } from 'src/modules/account/domain/AccountId';
import { CardTemplateId } from './CardTemplateId';
import { CardTemplate } from './CardTemplate';

export interface CardTemplateFilters {
  page: number;
  limit: number;
  name?: string;
}

export interface ICardTemplatesRepo {
  count(accountId: AccountId, filters: CardTemplateFilters): Promise<number>;
  findCardTemplateById(cardId: CardTemplateId, accountId: AccountId): Promise<CardTemplate>;
  findAllCardTemplates(accountId: AccountId, filters: CardTemplateFilters): Promise<{ count: number; cardTemplates: CardTemplate[] }>;
  exist(cardId: CardTemplateId, accountId: AccountId): Promise<boolean>;
  save(card: CardTemplate): Promise<void>;
}
