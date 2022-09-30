import { AggregateRoot } from '../../../core/domain/AggregateRoot';
import { UniqueEntityID } from '../../../core/domain/UniqueId';
import { Result } from '../../../core/logic/Result';
import { AccountId } from '../../accounts/domain/AccountId';
import { TreatmentId } from './TreatmentId';
import { TreatmentCardId } from './TreatmentCardId';
import { TREATMENT_ERRORS } from './TreatmentErrors';

export type TreatmentDurationInMinutes = number;
export type Price = number;
export interface TreatmentProps {
  accountId: AccountId;
  name: string;
  treatmentCardId?: TreatmentCardId | null | undefined;
  price?: Price;
  duration?: TreatmentDurationInMinutes;
  notes?: string;
}

export class Treatment extends AggregateRoot<TreatmentProps> {
  private constructor(readonly props: TreatmentProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get treatmentId() {
    return TreatmentId.create(this._uniqueEntityId).getValue();
  }

  get accountId() {
    return this.props.accountId;
  }

  get name() {
    return this.props.name;
  }

  get notes() {
    return this.props.notes;
  }

  get duration() {
    return this.props.duration;
  }

  get price() {
    return this.props.price;
  }

  get treatmentCardId() {
    return this.props.treatmentCardId;
  }

  public setName(name: string): Result<string> {
    const hasName = !!name;
    if (!hasName) {
      const error = Result.fail<string>(TREATMENT_ERRORS.NAME_ERROR_MESSAGE);
      return error;
    }
    this.props.name = name;
    return Result.ok('Treatment name has been set.');
  }

  public setNotes(notes: string | undefined): Result<string> {
    this.props.notes = notes;
    return Result.ok('Treatment notes has been set.');
  }

  public setDuration(duration: TreatmentDurationInMinutes): Result<string> {
    if (duration < 0) {
      const error = Result.fail<string>('Duration must be greater than 0.');
      return error;
    }
    this.props.duration = duration;
    return Result.ok('Treatment duration has been set.');
  }

  public setPrice(price: Price): Result<string> {
    if (price < 0) {
      const error = Result.fail<string>('Price must be greater than 0.');
      return error;
    }
    this.props.price = price;
    return Result.ok('Treatment price has been set.');
  }

  public setTreatmentCardId(cardId: TreatmentCardId): Result<string> {
    this.props.treatmentCardId = cardId;
    return Result.ok('Treatment card has been set.');
  }

  public static create(props: TreatmentProps, id: UniqueEntityID): Result<Treatment> {
    if (!props.accountId) {
      return Result.fail<Treatment>('Can not create new treatment without accountId.');
    }

    const treatment = new Treatment(
      {
        accountId: props.accountId,
        name: props.name,
        notes: props.notes,
        duration: props.duration,
        price: props.price,
        treatmentCardId: props.treatmentCardId,
      },
      id,
    );

    return Result.ok<Treatment>(treatment);
  }
}
