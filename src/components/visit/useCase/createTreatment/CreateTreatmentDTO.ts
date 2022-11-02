import { Price } from '../../domain/Treatment';

export interface CreateTreatmentDTO {
  accountId: string;
  name: string;
  treatmentCardId?: string;
  price?: Price;
  duration?: number;
  notes?: string;
}
