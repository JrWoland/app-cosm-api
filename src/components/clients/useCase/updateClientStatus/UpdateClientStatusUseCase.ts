import { UseCase } from '../../../../core/domain/UseCase';
import { Result } from '../../../../core/logic/Result';
import { UniqueEntityID } from '../../../../core/domain/UniqueId';
import { UpdateClientStatusDTO } from './UpdateClientStatusDTO';
import { IClientRepo } from '../../repo/ClientRepo';
import { IAccountRepo } from '../../../accounts/repo/AccountRepo';
import { Client } from '../../domain/Client';
import { ClientId } from '../../domain/ClientId';
import { CLIENT_ERROR } from '../../domain/ClientErrors';
import { AccountId } from '../../../accounts/domain/AccountId';

interface UpdateClientStatusResponseDTO {
  message: string;
  clientId: string;
  oldStatus: string;
  newStatus: string;
}

type Response = Result<UpdateClientStatusResponseDTO>;

export class UpdateClientStatusUseCase implements UseCase<UpdateClientStatusDTO, Promise<Response>> {
  constructor(private clientRepo: IClientRepo, private accountRepo: IAccountRepo) {}

  public async execute(request: UpdateClientStatusDTO): Promise<Response> {
    let client: Client;
    let oldStatus: string;
    const { status, clientId, accountId } = request;

    if (!clientId) {
      return Result.fail(CLIENT_ERROR.MISSING_CLIENT_ID);
    }

    const clientIdResult = ClientId.create(new UniqueEntityID(clientId)).getValue();
    const accountIdResult = AccountId.create(new UniqueEntityID(accountId)).getValue();

    try {
      client = await this.clientRepo.findClientById(clientIdResult, accountIdResult);
      oldStatus = client.status;
    } catch (error) {
      return Result.fail(CLIENT_ERROR.CLIENT_NOT_FOUND);
    }

    if (accountId !== client.accountId.id.getValue()) {
      return Result.fail(CLIENT_ERROR.CLIENT_NOT_FOUND);
    }

    const result = client.setClientStatus(status);

    if (result.isFailure) {
      return Result.fail(result.error);
    }

    await this.clientRepo.save(client);

    return Result.ok({ message: 'Client status updated.', clientId: clientId, newStatus: status, oldStatus });
  }
}
