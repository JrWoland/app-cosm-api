export interface UpdateClientDTO {
  accountId: string;
  clientId: string;
  name: string;
  surname?: string;
  birthDate?: Date;
  phone?: string;
  email?: string;
}
