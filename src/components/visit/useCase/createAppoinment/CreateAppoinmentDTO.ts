interface CardTemplate {
  name: string;
  identifier: string;
  selectedOptions: string[] | number[];
  availableOptions: string[] | number[];
  description: string;
}
interface CardDTO {
  id: string;
  name: string;
  template: CardTemplate[];
}
export interface TreatmentDTO {
  id: string;
  duration: number;
  startTime: number;
  price: number;
  card?: CardDTO;
}
export interface CreateAppoinmentDTO {
  accountId: string;
  date: string;
  clientId: string;
  startTime: number;
  duration: number;
  status: string;
  treatments: TreatmentDTO[];
}
