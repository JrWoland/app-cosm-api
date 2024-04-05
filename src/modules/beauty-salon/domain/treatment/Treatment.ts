import { AccountId } from 'src/modules/account/domain/AccountId';
import { TreatmentDuration } from './TreatmentDuration';
import { TreatmentName } from './TreatmentName';
import { TreatmentPrice } from './TreatmentPrice';
import { CardId } from '../card/CardId';
import { TreatmentId } from './TreatmentId';

import { AggregateRoot } from '@nestjs/cqrs';

export interface ITreatmentProps {
  readonly id: TreatmentId;
  readonly accountId: AccountId;
  readonly name: TreatmentName;
  readonly price: TreatmentPrice;
  readonly duration: TreatmentDuration;
  readonly defaultCardId: CardId | null;
}

export class Treatment extends AggregateRoot {
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

  public updateDetails(treatment: Pick<ITreatmentProps, 'name' | 'duration' | 'price' | 'defaultCardId'>) {
    if (treatment.name !== undefined) {
      this._name = treatment.name;
    }

    if (treatment.duration !== undefined) {
      this._duration = treatment.duration;
    }

    if (treatment.price !== undefined) {
      this._price = treatment.price;
    }

    if (treatment.defaultCardId !== undefined) {
      this._defaultCardId = treatment.defaultCardId;
    }
  }

  public static create(props: ITreatmentProps): Treatment {
    const { id, accountId, defaultCardId, duration, name, price } = props;

    return new Treatment(id, accountId, defaultCardId, name, price, duration);
  }
}
