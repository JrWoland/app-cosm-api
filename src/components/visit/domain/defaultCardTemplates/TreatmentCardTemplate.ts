export interface ICardTemplate {
  identifier: string;
  name: string;
  value: string[];
  options: string[] | number[];
  description?: string;
  custom?: unknown;
}
