export interface UpdateClientDTO {
  accountId: string;
  clientId: string;
  name: string;
  surname: string;
  birthDate: string | null;
  phone: string;
  email: string;
}
