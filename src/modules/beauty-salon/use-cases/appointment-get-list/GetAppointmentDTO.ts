export interface GetAppointmentListDTO {
  page: number;
  limit: number;
  status: string;
  dateFrom: string;
  dateTo: string;
  clientId: string;
  beautyServiceId: string;
}
