export interface UpdateTreatmentDTO {
  accountId: string;
  treatmentId: string;
  name: string;
  price?: number;
  duration?: number;
  notes?: string;
}
