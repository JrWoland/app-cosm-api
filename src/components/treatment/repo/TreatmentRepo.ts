import { Model } from 'mongoose';
import { TreatmentDocModel } from '../../../infra/db/models/treatmentModel';
import { Treatment } from '../domain/Treatment';
import { TreatmentId } from '../domain/TreatmentId';
import { TreatmentMap } from './mappers/TreatmentMap';

export interface ITreatmentRepo {
  findTreatmentById(treatmentId: TreatmentId): Promise<Treatment>;
  exists(treatmentId: TreatmentId): Promise<boolean>;
  save(treatment: Treatment): Promise<void>;
}

export class TreatmentRepo implements ITreatmentRepo {
  constructor(private model: Model<TreatmentDocModel>) {}

  public async findTreatmentById(treatmentId: TreatmentId): Promise<Treatment> {
    try {
      const treatment = await this.model.find({ _id: treatmentId.value.toString() });

      if (treatment.length === 0) {
        throw new Error('Treatment does not exists.');
      }

      return new TreatmentMap().toDomain(treatment[0]);
    } catch {
      throw new Error('Can not find treatment by treatmentId.');
    }
  }

  public async exists(treatmentId: TreatmentId): Promise<boolean> {
    try {
      const treatmentExists = this.model.exists({ _id: treatmentId.value });
      return treatmentExists;
    } catch (error) {
      throw new Error('Can not check if treatment exists.');
    }
  }

  public async save(treatment: Treatment): Promise<void> {
    try {
      const treatmentToSave = new TreatmentMap().toPersistence(treatment);

      const exists = await this.model.exists({ _id: treatment.treatmentId.value });

      if (!exists) {
        const newTreatment = new this.model(treatmentToSave);
        await newTreatment.save();
      } else {
        await this.model.findOneAndUpdate(
          {
            _id: treatment.treatmentId.value,
          },
          treatmentToSave,
        );
      }
    } catch (error) {
      throw new Error('Can not save treatment: ' + error);
    }
  }
}
