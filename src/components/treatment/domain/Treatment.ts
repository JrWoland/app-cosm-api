import { Entity } from '../../../core/domain/Entity';
import { UniqueEntityID } from '../../../core/domain/UniqueId';
import { Result } from '../../../core/logic/Result';
import { AccountId } from '../../accounts/domain/AccountId';
import { TreatmentId } from './TreatmentId';
import { TreatmentCardId } from './TreatmentCardId';

export interface TreatmentProps {
  accountId: AccountId;
  treatmentCardId: TreatmentCardId | null;
  name: string;
  price?: number;
  duration?: number;
  notes?: string;
}

export class Treatment extends Entity<TreatmentProps> {
  private constructor(props: TreatmentProps, id?: UniqueEntityID) {
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
        treatmentCardId: props.treatmentCardId, // 1 or 2
      },
      id,
    );

    return Result.ok<Treatment>(treatment);
  }
}
