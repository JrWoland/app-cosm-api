import { UniqueEntityID } from '../../../../core/domain/UniqueId';
import { Mapper } from '../../../../core/infra/Mapper';
import { TreatmentDocModel } from '../../../../infra/db/models/treatmentModel';
import { AccountId } from '../../../accounts/domain/AccountId';
import { Treatment } from '../../domain/Treatment';
import { TreatmentId } from '../../domain/TreatmentId';

export class TreatmentMap implements Mapper<Treatment, TreatmentDocModel> {
  public toPersistence(treatment: Treatment): TreatmentDocModel {
    return {
      _id: treatment.treatmentId.value.toString(),
      account_id: treatment.accountId.id.getValue(),
      duration: treatment.duration,
      name: treatment.name,
      notes: treatment.notes,
      price: { value: treatment.price },
      treatment_card_id: treatment.treatmentCardId?.value,
    };
  }

  public toDomain(raw: TreatmentDocModel): Treatment {
    const accountId = AccountId.create(new UniqueEntityID(raw.account_id));
    const treatmentId = TreatmentId.create(new UniqueEntityID(raw._id));

    const treatment = Treatment.create(
      {
        accountId: accountId.getValue(),
        name: raw.name,
        duration: raw.duration,
        notes: raw.notes,
        price: raw.price?.value,
        treatmentCardId: raw.treatment_card_id ? treatmentId.getValue() : undefined,
      },
      new UniqueEntityID(raw._id),
    );

    return treatment.getValue();
  }
}
