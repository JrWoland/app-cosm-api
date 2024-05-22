import { AccountId } from 'src/modules/account/domain/AccountId';
import { Card } from './Card';
import { CardId } from './CardId';

export interface CardFilters {
  page: number;
  limit: number;
  clientId?: string;
  appointmentId?: string;
  templateName?: string;
}

export interface IDeleteCardResult {
  id: string;
  message: string;
  success: boolean;
}
export interface ICardsRepo {
  count(accountId: AccountId, filters: CardFilters): Promise<number>;
  findCardById(cardId: CardId, accountId: AccountId): Promise<Card>;
  findAllCards(accountId: AccountId, filters: CardFilters): Promise<{ count: number; cards: Card[] }>;
  deleteOne(cardId: CardId, accountId: AccountId): Promise<IDeleteCardResult>;
  exist(cardId: CardId, accountId: AccountId): Promise<boolean>;
  save(card: Card): Promise<void>;
}
