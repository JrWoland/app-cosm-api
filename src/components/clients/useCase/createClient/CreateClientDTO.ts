export interface CreateClientDTO {
  accountId: string;
  name: string;
  surname?: string;
  birthDate?: Date;
  phone?: string;
  email?: string;
}
