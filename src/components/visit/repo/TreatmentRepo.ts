import { Model } from 'mongoose';
import { TreatmentDocModel } from '../../../infra/db/models/treatmentModel';
import { AccountId } from '../../accounts/domain/AccountId';
import { Treatment } from '../domain/Treatment';
import { TreatmentId } from '../domain/TreatmentId';
import { TreatmentMap } from './mappers/TreatmentMap';

export interface ITreatmentRepo {
  findTreatmentById(treatmentId: TreatmentId, accountId: AccountId): Promise<Treatment>;
  findTreatmentsByIds(treatmentIds: TreatmentId[], accountId: AccountId): Promise<Treatment[]>;
  exists(treatment: Treatment): Promise<boolean>;
  save(treatment: Treatment): Promise<void>;
}

export class TreatmentRepo implements ITreatmentRepo {
  constructor(private model: Model<TreatmentDocModel>) {}

  public async findTreatmentById(treatmentId: TreatmentId, accountId: AccountId): Promise<Treatment> {
    try {
      const treatment = await this.model.find({ _id: treatmentId.value.toString(), account_id: accountId.id.getValue() });

      if (treatment.length === 0) {
        throw new Error('Treatment does not exists.');
      }

      return new TreatmentMap().toDomain(treatment[0]);
    } catch {
      throw new Error('Can not find treatment by treatmentId.');
    }
  }

  public async findTreatmentsByIds(treatmentIds: TreatmentId[], accountId: AccountId): Promise<Treatment[]> {
    const ids = treatmentIds.map((i) => i.value);

    try {
      const result = await this.model.find({
        _id: { $in: ids },
        account_id: accountId.id.getValue(),
      });

      const treatments = result.map((treatment) => new TreatmentMap().toDomain(treatment));

      return treatments;
    } catch (error) {
      throw new Error('Can not find treatment by treatmentIds.');
    }
  }

  public async exists(treatment: Treatment): Promise<boolean> {
    try {
      const treatmentExists = this.model.exists({
        _id: treatment.treatmentId.value,
        account_id: treatment.accountId.id.getValue(),
      });
      return treatmentExists;
    } catch (error) {
      throw new Error('Can not check if treatment exists.');
    }
  }

  public async save(treatment: Treatment): Promise<void> {
    const trId = treatment.treatmentId.value;

    try {
      const treatmentToSave = new TreatmentMap().toPersistence(treatment);

      const exists = await this.exists(treatment);

      if (!exists) {
        const newTreatment = new this.model(treatmentToSave);
        await newTreatment.save();
      } else {
        const result = await this.model.updateOne(
          {
            _id: trId,
            account_id: treatment.accountId.id.getValue(),
          },
          treatmentToSave,
        );

        if (result.nModified === 0) throw new Error(`Treatment ${trId} not found.`);
      }
    } catch (error) {
      throw new Error('Can not save treatment with id: ' + trId);
    }
  }
}
