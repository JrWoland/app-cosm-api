import { AccountId } from 'src/modules/account/domain/AccountId';
import { TreatmentDuration } from './TreatmentDuration';
import { TreatmentName } from './TreatmentName';
import { TreatmentPrice } from './TreatmentPrice';
import { CardId } from '../card/CardId';
import { TreatmentId } from './TreatmentId';
import { Entity } from 'src/shared/Entity';
import { UnprocessableEntityException } from '@nestjs/common';

export interface ITreatmentProps {
  readonly id: TreatmentId;
  readonly accountId: AccountId;
  readonly name: TreatmentName;
  readonly price: TreatmentPrice;
  readonly duration: TreatmentDuration;
  readonly defaultCardId: CardId | null;
}

export class Treatment extends Entity {
  private MAX_DURATION_MINUTES_LENGTH = 1440;

  private constructor(
    private readonly _id: TreatmentId,
    private readonly _accountId: AccountId,
    private _defaultCardId: CardId | null,
    private _name: TreatmentName,
    private _price: TreatmentPrice,
    private _duration: TreatmentDuration,
  ) {
    super();
  }

  public get id(): TreatmentId {
    return this._id;
  }

  public get accountId(): AccountId {
    return this._accountId;
  }

  public get defaultCardId(): CardId | null {
    return this._defaultCardId;
  }

  public get name(): TreatmentName {
    return this._name;
  }

  public get price(): TreatmentPrice {
    return this._price;
  }

  public get duration(): TreatmentDuration {
    return this._duration;
  }

  changeDefaultDuration(duration: TreatmentDuration) {
    if (duration.value > this.MAX_DURATION_MINUTES_LENGTH) {
      throw new UnprocessableEntityException('Duration cannot be longer than 24h.');
    }

    this._duration = duration;
  }

  public static create(props: ITreatmentProps): Treatment {
    const { id, accountId, defaultCardId, duration, name, price } = props;

    return new Treatment(id, accountId, defaultCardId, name, price, duration);
  }
}
