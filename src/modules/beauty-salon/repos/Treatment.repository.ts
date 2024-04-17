import { Injectable, InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { ITreatmentFilter, ITreatmentRepo, ITreatmentsList } from '../domain/treatment/ITreatmentRepo';
import { TreatmentModel } from 'src/db/mongoose/treatment.sheema';
import { AccountId } from 'src/modules/account/domain/AccountId';
import { Treatment } from '../domain/treatment/Treatment';
import { TreatmentId } from '../domain/treatment/TreatmentId';
import { TreatmentMap } from './mappers/TreatmentMap';

@Injectable()
export class TreatmentRepository implements ITreatmentRepo {
  constructor(@InjectModel(TreatmentModel.name) private model: Model<TreatmentModel>) {}

  private buildQuery(accountId: AccountId, filters: ITreatmentFilter): FilterQuery<TreatmentModel> {
    const mongooseQuery: FilterQuery<TreatmentModel> = {
      account_id: accountId.value,
    };

    if (filters.name) mongooseQuery.name = { $regex: new RegExp(filters.name || '', 'i') };

    if (filters.archived !== undefined) mongooseQuery.is_archived = filters.archived;

    return mongooseQuery;
  }

  public async count(accountId: AccountId, filters: ITreatmentFilter): Promise<number> {
    try {
      const query = this.buildQuery(accountId, filters);
      const numberOfTreatments = await this.model.countDocuments(query);
      return numberOfTreatments;
    } catch (error) {
      throw new InternalServerErrorException(`Could not count treatments: ${error}`);
    }
  }

  public async findAllTreatmentsList(accountId: AccountId, filters: ITreatmentFilter): Promise<ITreatmentsList> {
    try {
      const result = await this.model
        .find(this.buildQuery(accountId, filters))
        .limit(filters.limit * 1)
        .skip((filters.page - 1) * filters.limit)
        .sort({ date: 'desc' });

      const count = await this.count(accountId, filters);
      const treatments = result.map((treatment) => new TreatmentMap().toDomain(treatment));

      return { count, treatments };
    } catch (error) {
      throw new InternalServerErrorException(`Can not find treatments: ${error}`);
    }
  }

  public async findTreatmentById(treatmentId: TreatmentId, accountId: AccountId): Promise<Treatment> {
    try {
      const treatment = await this.model.find({ _id: treatmentId.value.toString(), account_id: accountId.value });

      if (treatment.length === 0) {
        throw new UnprocessableEntityException('Treatment does not exist.');
      }

      return new TreatmentMap().toDomain(treatment[0]);
    } catch {
      throw new InternalServerErrorException('Can not find treatment by treatmentId.');
    }
  }

  public async findTreatmentsByIds(treatmentIds: TreatmentId[], accountId: AccountId): Promise<Treatment[]> {
    const ids = treatmentIds.map((i) => i.value);

    try {
      const result = await this.model.find({
        _id: { $in: ids },
        account_id: accountId.value,
      });

      const treatments = result.map((treatment) => new TreatmentMap().toDomain(treatment));

      return treatments;
    } catch (error) {
      throw new InternalServerErrorException(`Can not find treatment by treatmentIds`);
    }
  }

  public async exists(treatment: Treatment): Promise<boolean> {
    try {
      const doc = await this.model.exists({
        _id: treatment.id.value,
        account_id: treatment.accountId.value,
      });
      return !!doc;
    } catch (error) {
      throw new InternalServerErrorException('Can not check if treatment exists.');
    }
  }

  public async save(treatment: Treatment): Promise<void> {
    try {
      const treatmentToSave = new TreatmentMap().toPersistence(treatment);

      const exists = await this.exists(treatment);

      if (!exists) {
        const newTreatment = new this.model(treatmentToSave);
        await newTreatment.save();
      } else {
        const result = await this.model.updateOne(
          {
            _id: treatment.id.value,
            account_id: treatment.accountId.value,
          },
          treatmentToSave,
        );

        if (result.modifiedCount === 0) throw new Error(`Treatment ${treatment.id} not found.`);
      }
    } catch (error) {
      throw new Error('Can not save treatment with id: ' + treatment.id);
    }
  }
}
