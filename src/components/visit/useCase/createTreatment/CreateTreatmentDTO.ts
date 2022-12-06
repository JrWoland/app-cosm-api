export interface CreateTreatmentDTO {
  accountId: string;
  name: string;
  treatmentCardId?: string;
  price?: number;
  duration?: number;
  notes?: string;
}
