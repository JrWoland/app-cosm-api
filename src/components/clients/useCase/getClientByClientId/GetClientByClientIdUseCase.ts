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
  surname: string;
  birthDate: Date;
  phone: string;
  email: string;
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
        name: client.name,
        surname: client.surname || '',
        birthDate: new Date(client.birthDay || ''),
        phone: client.phone || '',
        email: client.email || '',
        status: client.status,
      };

      return Result.ok(result);
    } catch (error) {
      return Result.fail(error.message);
    }
  }
}