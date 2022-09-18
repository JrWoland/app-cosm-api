import { ClientStatus } from '../../domain/ClientStatus';

export interface UpdateClientStatusDTO {
  accountId: string;
  clientId: string;
  status: ClientStatus;
}
