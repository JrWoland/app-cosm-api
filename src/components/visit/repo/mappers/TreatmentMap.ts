import { UniqueEntityID } from '../../../../core/domain/UniqueId';
import { Mapper } from '../../../../core/infra/Mapper';
import { TreatmentDocModel } from '../../../../infra/db/models/treatmentModel';
import { AccountId } from '../../../accounts/domain/AccountId';
import { Treatment } from '../../domain/Treatment';
import { TreatmentId } from '../../domain/TreatmentId';
import { CardMap } from './CardMap';

export class TreatmentMap implements Mapper<Treatment, TreatmentDocModel> {
  public toPersistence(treatment: Treatment): TreatmentDocModel {
    return {
      _id: treatment.treatmentId.value.toString(),
      account_id: treatment.accountId.id.getValue(),
      duration: treatment.duration,
      start_time: treatment.startTime,
      name: treatment.name,
      notes: treatment.notes,
      price: { value: treatment.price },
      treatment_card_id: treatment.assingedCardId?.value,
      filled_card: treatment.filledCard ? new CardMap().toPersistence(treatment.filledCard) : undefined,
    };
  }

  public toDomain(raw: TreatmentDocModel): Treatment {
    const accountId = AccountId.create(new UniqueEntityID(raw.account_id));
    const treatmentId = TreatmentId.create(new UniqueEntityID(raw.treatment_card_id));

    const card = raw.filled_card ? new CardMap().toDomain(raw.filled_card) : undefined;

    const treatment = Treatment.create(
      {
        accountId: accountId.getValue(),
        name: raw.name,
        duration: raw.duration,
        startTime: raw.start_time,
        notes: raw.notes,
        price: raw.price?.value,
        assingedCardId: raw.treatment_card_id ? treatmentId.getValue() : undefined,
        filledCard: card,
      },
      new UniqueEntityID(raw._id),
    );

    return treatment.getValue();
  }
}
