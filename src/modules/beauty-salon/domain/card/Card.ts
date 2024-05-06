import { AggregateRoot } from '@nestjs/cqrs';
import { CardId } from './CardId';
import { AppointmentId } from '../appointment/AppointmentId';
import { ClientId } from '../client/ClientId';
import { AccountId } from 'src/modules/account/domain/AccountId';
import { CardTemplate } from './CardTemplate';
import { CardDate } from './CardDate';

interface ICardProps {
  id: CardId;
  accountId: AccountId;
  appointmentId: AppointmentId | null;
  clientId: ClientId;
  date: CardDate;
  template: CardTemplate;
}

export class Card extends AggregateRoot {
  private constructor(
    private readonly _id: CardId,
    private readonly _accountId: AccountId,
    private readonly _appointmentId: AppointmentId | null,
    private readonly _clientId: ClientId,
    private readonly _date: CardDate,
    private readonly _template: CardTemplate,
  ) {
    super();
  }

  public get id(): CardId {
    return this._id;
  }

  public get accountId(): AccountId {
    return this._accountId;
  }

  public get appointmentId(): AppointmentId | null {
    return this._appointmentId || null;
  }

  public get clientId(): ClientId {
    return this._clientId;
  }

  public get date(): CardDate {
    return this._date;
  }

  public get template(): CardTemplate {
    return this._template;
  }

  public static create(props: ICardProps): Card {
    const { id, clientId, accountId, appointmentId, date, template } = props;

    return new Card(id, accountId, appointmentId, clientId, date, template);
  }
}
