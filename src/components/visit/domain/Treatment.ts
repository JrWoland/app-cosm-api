import { UniqueEntityID } from '../../../core/domain/UniqueId';
import { Result } from '../../../core/logic/Result';
import { AccountId } from '../../accounts/domain/AccountId';
import { TreatmentId } from './TreatmentId';
import { TreatmentCardId } from './TreatmentCard/TreatmentCardId';
import { TREATMENT_ERRORS } from './TreatmentErrors';
import { has } from 'lodash';
import { Entity } from '../../../core/domain/Entity';
import { TreatmentCard } from './TreatmentCard/TreatmentCard';

export type Minutes = number;
export type Price = number;
export interface TreatmentProps {
  accountId: AccountId;
  name: string;
  assingedCardId?: TreatmentCardId;
  filledTreatmentCard?: TreatmentCard;
  price?: Price;
  duration?: Minutes;
  startTime?: Minutes;
  notes?: string;
}

export class Treatment extends Entity<TreatmentProps> {
  private constructor(readonly props: TreatmentProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public get treatmentId() {
    return TreatmentId.create(this._uniqueEntityId).getValue();
  }

  public get accountId() {
    return this.props.accountId;
  }

  public get name() {
    return this.props.name;
  }

  public get notes() {
    return this.props.notes;
  }

  public get duration() {
    return this.props.duration;
  }

  public get startTime() {
    return this.props.startTime;
  }

  public get price() {
    return this.props.price;
  }

  public get assingedCardId() {
    return this.props.assingedCardId;
  }

  private setName(name: string): Result<string> {
    const hasName = !!name;
    if (!hasName) {
      const error = Result.fail<string>(TREATMENT_ERRORS.NAME_ERROR_MESSAGE);
      return error;
    }
    this.props.name = name;
    return Result.ok('Treatment name has been set.');
  }

  private setNotes(notes: string): Result<string> {
    this.props.notes = notes;
    return Result.ok('Treatment notes has been set.');
  }

  private setDuration(duration: Minutes): Result<string> {
    if (duration < 0) {
      const error = Result.fail<string>(TREATMENT_ERRORS.DURATION_ERROR_MESSAGE);
      return error;
    }
    this.props.duration = duration;
    return Result.ok('Treatment duration has been set.');
  }

  private setPrice(price: Price): Result<string> {
    if (price < 0) {
      const error = Result.fail<string>(TREATMENT_ERRORS.PRICE_ERROR_MESSAGE);
      return error;
    }
    this.props.price = price;
    return Result.ok('Treatment price has been set.');
  }

  public setTreatmentCardId(cardId: TreatmentCardId): Result<string> {
    this.props.assingedCardId = cardId;
    return Result.ok('Treatment card has been set.');
  }

  public setFilledTreatmentCard(card: TreatmentCard): Result<string> {
    if (!card.isTemplateFilled) {
      return Result.fail('Treatment card must be filled in.');
    }
    this.props.filledTreatmentCard = card;
    return Result.ok('Treatment card has been set.');
  }

  public updateDetails(treatment: Partial<Omit<TreatmentProps, 'treatmentId' | 'accountId'>>): Result<string> {
    const results: Result<string>[] = [];

    if (has(treatment, 'name')) {
      results.push(this.setName(treatment.name || ''));
    }
    if (has(treatment, 'notes')) {
      results.push(this.setNotes(treatment.notes || ''));
    }
    if (has(treatment, 'duration')) {
      results.push(this.setDuration(treatment.duration || 0));
    }
    if (has(treatment, 'price')) {
      results.push(this.setPrice(treatment.price || 0));
    }

    const bulkResult = Result.bulkCheck<string>(results);

    if (bulkResult.isFailure) {
      return Result.fail(bulkResult.error);
    }

    return Result.ok(bulkResult.getValue());
  }

  public static create(props: TreatmentProps, id: UniqueEntityID): Result<Treatment> {
    if (!props.accountId) {
      return Result.fail<Treatment>('Can not create new treatment without accountId property.');
    }
    if (!props.name) {
      return Result.fail<Treatment>('Can not create new treatment without name property.');
    }
    if ((props.duration || 0) < 0) {
      return Result.fail<Treatment>(TREATMENT_ERRORS.DURATION_ERROR_MESSAGE);
    }
    if ((props.price || 0) < 0) {
      return Result.fail<Treatment>(TREATMENT_ERRORS.PRICE_ERROR_MESSAGE);
    }
    if ((props.startTime || 0) < 0) {
      return Result.fail<Treatment>(TREATMENT_ERRORS.START_TIME_ERROR_MESSAGE);
    }

    const treatment = new Treatment(
      {
        accountId: props.accountId,
        name: props.name,
        notes: props.notes,
        duration: props.duration,
        price: props.price,
        assingedCardId: props.assingedCardId,
      },
      id,
    );

    return Result.ok<Treatment>(treatment);
  }
}
