import { AccountId } from 'src/modules/account/domain/AccountId';
import { TreatmentId } from './TreatmentId';
import { Treatment } from './Treatment';

export interface ITreatmentFilter {
  page: number;
  limit: number;
  status: string;
  name: string;
}

export interface ITreatmentsList {
  count: number;
  treatments: Treatment[];
}

export interface ITreatmentRepo {
  findAllTreatmentsList(accountId: AccountId, filters: ITreatmentFilter): Promise<ITreatmentsList>;
  findTreatmentById(treatmentId: TreatmentId, accountId: AccountId): Promise<Treatment>;
  findTreatmentsByIds(treatmentIds: TreatmentId[], accountId: AccountId): Promise<Treatment[]>;
  exists(treatment: Treatment): Promise<boolean>;
  save(treatment: Treatment): Promise<void>;
}
