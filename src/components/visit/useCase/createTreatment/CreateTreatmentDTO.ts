import { Price, TreatmentDurationInMinutes } from '../../domain/Treatment';

export interface CreateTreatmentDTO {
  accountId: string;
  name: string;
  treatmentCardId?: string;
  price?: Price;
  duration?: TreatmentDurationInMinutes;
  notes?: string;
}
