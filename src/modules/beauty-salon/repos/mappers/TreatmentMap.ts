import { Mapper } from 'src/shared/Mapper';
import { Treatment } from '../../domain/treatment/Treatment';
import { TreatmentModel } from 'src/db/mongoose/treatment.sheema';
import { UniqueEntityID } from 'src/shared/UniqueId';
import { AccountId } from 'src/modules/account/domain/AccountId';
import { TreatmentId } from '../../domain/treatment/TreatmentId';
import { TreatmentName } from '../../domain/treatment/TreatmentName';
import { TreatmentDuration } from '../../domain/treatment/TreatmentDuration';
import { TreatmentPrice } from '../../domain/treatment/TreatmentPrice';
import { CardId } from '../../domain/card/CardId';

export class TreatmentMap implements Mapper<Treatment, TreatmentModel> {
  public toPersistence(treatment: Treatment): TreatmentModel {
    return {
      _id: treatment.id.value,
      account_id: treatment.accountId.value,
      name: treatment.name.value,
      default_price: { value: treatment.price.value, currency: null },
      default_duration: treatment.duration.value,
      default_card_id: treatment.defaultCardId?.value || null,
    };
  }

  public toDomain(raw: TreatmentModel): Treatment {
    const treatment = Treatment.create({
      id: TreatmentId.create(new UniqueEntityID(raw._id)),
      accountId: AccountId.create(new UniqueEntityID(raw.account_id)),
      name: TreatmentName.create(raw.name),
      duration: TreatmentDuration.create(raw.default_duration),
      price: TreatmentPrice.create(raw.default_price.value || 0),
      defaultCardId: CardId.create(new UniqueEntityID(raw.default_card_id)),
    });

    return treatment;
  }
}
