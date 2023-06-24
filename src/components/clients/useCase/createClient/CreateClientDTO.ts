export interface CreateClientDTO {
  accountId: string;
  name: string;
  surname?: string | null;
  birthDate?: Date | null;
  phone?: string | null;
  email?: string | null;
}
