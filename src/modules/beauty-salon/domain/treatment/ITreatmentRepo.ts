import { AccountId } from 'src/modules/account/domain/AccountId';
import { TreatmentId } from './TreatmentId';
import { Treatment } from './Treatment';

export interface ITreatmentRepo {
  findTreatmentById(treatmentId: TreatmentId, accountId: AccountId): Promise<Treatment>;
  findTreatmentsByIds(treatmentIds: TreatmentId[], accountId: AccountId): Promise<Treatment[]>;
  exists(treatment: Treatment): Promise<boolean>;
  save(treatment: Treatment): Promise<void>;
}
