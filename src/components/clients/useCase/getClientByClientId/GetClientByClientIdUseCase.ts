import { UniqueEntityID } from '../../../../core/domain/UniqueId';
import { UseCase } from '../../../../core/domain/UseCase';
import { Result } from '../../../../core/logic/Result';
import { AccountId } from '../../../accounts/domain/AccountId';
import { ClientId } from '../../domain/ClientId';
import { IClientRepo } from '../../repo/ClientRepo';
import { GetClientDTO } from './GetClientByClientIdDTO';

export interface ResponseClientDTO {
  id: string;
  name: string;
  surname: string | null;
  birthDate: Date | null;
  phone: string | null;
  email: string | null;
  status: string;
}

type Response = Result<ResponseClientDTO>;

export class GetClientByClientIdUseCase implements UseCase<GetClientDTO, Promise<Response>> {
  constructor(private clientRepo: IClientRepo) {}

  public async execute(req: GetClientDTO): Promise<Response> {
    const { accountId, clientId } = req;

    const clientIdResult = ClientId.create(new UniqueEntityID(clientId));
    const accountIdResult = AccountId.create(new UniqueEntityID(accountId));

    if (clientIdResult.isFailure || accountIdResult.isFailure) {
      return Result.fail(`${clientIdResult.error}. ${accountIdResult.error}`);
    }

    try {
      const client = await this.clientRepo.findClientById(clientIdResult.getValue(), accountIdResult.getValue());

      const result: ResponseClientDTO = {
        id: client.clientId.value,
        name: client.name.value,
        surname: client.surname.value || null,
        birthDate: new Date(client.birthDay.value || ''),
        phone: client.phone.value || null,
        email: client.email.value || null,
        status: client.status,
      };

      return Result.ok(result);
    } catch (error) {
      return Result.fail(error.message);
    }
  }
}
