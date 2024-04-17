export interface GetTreatmentsListDTO {
  page: number;
  limit: number;
  status: string;
  name: string;
  archived: boolean;
}
