import { UniqueEntityID } from '../../../core/domain/UniqueId';
import { Entity } from '../../../core/domain/Entity';
import { Result } from '../../../core/logic/Result';
import { TreatmentCardId } from './TreatmentCardId';
import { ClientId } from '../../clients/domain/ClientId';

interface LashesCardTemplate {
  id: 'LASHES';
  glue: string;
  remover: string;
}

interface NailsCardTemplate {
  id: 'NAILS';
  length: string;
  colors: string;
}

interface TreatmentCardProps {
  clientId: ClientId;
  template: LashesCardTemplate | NailsCardTemplate | any;
  price?: number;
  duration?: number;
  notes?: string;
}

export class TreatmentCard extends Entity<TreatmentCardProps> {
  private constructor(props: TreatmentCardProps, id?: UniqueEntityID) {
    super(props, id);
  }

  get treatmentCardId(): TreatmentCardId {
    return TreatmentCardId.create(this._uniqueEntityId).getValue();
  }

  public static create(props: TreatmentCardProps, id?: UniqueEntityID): Result<TreatmentCard> {
    if (!props.clientId) {
      return Result.fail<TreatmentCard>('Can not create client treatment card without clientId.');
    }

    const treatmentCard = new TreatmentCard(
      {
        clientId: props.clientId,
        template: props.template,
        price: props.price,
        duration: props.duration,
        notes: props.notes,
      },
      id,
    );

    return Result.ok<TreatmentCard>(treatmentCard);
  }
}
