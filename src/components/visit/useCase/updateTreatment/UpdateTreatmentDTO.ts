import { Price, TreatmentDurationInMinutes } from '../../domain/Treatment';

export interface UpdateTreatmentDTO {
  accountId: string;
  treatmentId: string;
  name: string;
  price?: Price;
  duration?: TreatmentDurationInMinutes;
  notes?: string;
}
