import { UseCase } from '../../../../core/domain/UseCase';
import { Result } from '../../../../core/logic/Result';
import { UniqueEntityID } from '../../../../core/domain/UniqueId';
import { UpdateClientDTO } from './UpdateClientDTO';
import { IClientRepo } from '../../repo/ClientRepo';
import { IAccountRepo } from '../../../accounts/repo/AccountRepo';
import { Client } from '../../domain/Client';
import { ClientId } from '../../domain/ClientId';
import { CLIENT_ERROR } from '../../domain/ClientErrors';
import { AccountId } from '../../../accounts/domain/AccountId';

interface UpdateClientResponseDTO {
  message: string;
  clientId: string;
}

type Response = Result<UpdateClientResponseDTO>;

export class UpdateClientUseCase implements UseCase<UpdateClientDTO, Promise<Response>> {
  constructor(private clientRepo: IClientRepo, private accountRepo: IAccountRepo) {}

  public async execute(request: UpdateClientDTO): Promise<Response> {
    let client: Client;

    const { accountId, clientId, name, birthDate, email, phone, surname } = request;

    if (!clientId) {
      return Result.fail(CLIENT_ERROR.MISSING_CLIENT_ID);
    }

    const clientIdResult = ClientId.create(new UniqueEntityID(clientId)).getValue();
    const accountIdResult = AccountId.create(new UniqueEntityID(accountId)).getValue();

    try {
      client = await this.clientRepo.findClientById(clientIdResult, accountIdResult);
    } catch (error) {
      return Result.fail(CLIENT_ERROR.CLIENT_NOT_FOUND);
    }

    if (accountId !== client.accountId.id.getValue()) {
      return Result.fail(CLIENT_ERROR.CLIENT_NOT_FOUND);
    }

    const updateResult = client.updateDetails({
      name,
      surname,
      phone,
      email,
      birthDay: birthDate ? new Date(birthDate) : null,
    });

    if (updateResult.isFailure) {
      return Result.fail(updateResult.error);
    }

    await this.clientRepo.save(client);

    return Result.ok({ message: 'Client updated.', clientId: clientId });
  }
}
