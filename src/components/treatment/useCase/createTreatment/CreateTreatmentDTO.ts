import { Price, TreatmentDurationInMinutes } from '../../domain/Treatment';
import { TreatmentCardId } from '../../domain/TreatmentCardId';

export interface CreateTreatmentDTO {
  accountId: string;
  name: string;
  treatmentCardId?: TreatmentCardId;
  price?: Price;
  duration?: TreatmentDurationInMinutes;
  notes?: string;
}
