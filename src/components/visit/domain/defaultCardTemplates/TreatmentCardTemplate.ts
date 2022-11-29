export interface ICardField {
  identifier: string;
  name: string;
  selectedOptions: string[] | number[];
  availableOptions: string[] | number[];
  description?: string;
  custom?: unknown;
}
