export interface TreatmentCardTemplate {
  identifier: string;
  name: string;
  value: string[];
  options: string[] | number[];
  description?: string;
  custom?: unknown;
}
