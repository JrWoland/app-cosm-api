export interface CreateClientDTO {
  accountId: string;
  name: string;
  surname?: string | null;
  birthDate?: string | null;
  phone?: string | null;
  email?: string | null;
}
