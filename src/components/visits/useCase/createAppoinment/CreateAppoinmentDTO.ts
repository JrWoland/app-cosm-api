export interface CreateAppoinmentDTO {
  accountId: string;
  date: Date;
  clientId?: string;
  startTime: number;
  duration: number;
  treatments: [];
}
