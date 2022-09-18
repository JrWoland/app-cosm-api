import { UseCase } from '../../../../core/domain/UseCase';
import { Result } from '../../../../core/logic/Result';
import { UniqueEntityID } from '../../../../core/domain/UniqueId';
import { UpdateClientStatusDTO } from './UpdateClientStatusDTO';
import { IClientRepo } from '../../repo/ClientRepo';
import { IAccountRepo } from '../../../accounts/repo/AccountRepo';
import { Client } from '../../domain/Client';
import { ClientId } from '../../domain/ClientId';
import { CLIENT_ERROR } from '../../domain/ClientErrors';

interface UpdateClientStatusResponseDTO {
  message: string;
  clientId: string;
  newStatus: string;
}

type Response = Result<UpdateClientStatusResponseDTO>;

export class UpdateClientStatusUseCase implements UseCase<UpdateClientStatusDTO, Promise<Response>> {
  constructor(private clientRepo: IClientRepo, private accountRepo: IAccountRepo) {}

  public async execute(request: UpdateClientStatusDTO): Promise<Response> {
    let client: Client;

    const { status, clientId, accountId } = request;

    if (!clientId) {
      return Result.fail(CLIENT_ERROR.MISSING_CLIENT_ID);
    }

    try {
      client = await this.clientRepo.findClientById(ClientId.create(new UniqueEntityID(clientId)).getValue());
    } catch (error: any) {
      return Result.fail(CLIENT_ERROR.CLIENT_NOT_FOUND);
    }

    if (accountId !== client.accountId.id.getValue()) {
      return Result.fail(CLIENT_ERROR.CLIENT_NOT_FOUND);
    }

    client.setClientStatus(status);

    if (client.isAnyErrorRegistered) {
      return Result.fail(client.errors.reduce((prev, curr) => (prev += curr.error), ''));
    }

    await this.clientRepo.save(client);

    return Result.ok({ message: 'Client status updated.', clientId: clientId, newStatus: status });
  }
}
