import { UseCase } from '../../../../core/domain/UseCase';
import { Result } from '../../../../core/logic/Result';
import { UniqueEntityID } from '../../../../core/domain/UniqueId';
import { CreateClientDTO } from './CreateClientDTO';
import { IClientRepo } from '../../repo/ClientRepo';
import { IAccountRepo } from '../../../accounts/repo/AccountRepo';
import { AccountId } from '../../../accounts/domain/AccountId';
import { Account } from '../../../accounts/domain/Account';
import { Client } from '../../domain/Client';
import { ClientStatus } from '../../domain/ClientStatus';

interface ClientResponseDTO {
  message: string;
  clientId: string;
}

type Response = Result<ClientResponseDTO>;

export class CreateClientUseCase implements UseCase<CreateClientDTO, Promise<Response>> {
  constructor(private clientRepo: IClientRepo, private accountRepo: IAccountRepo) {}

  public async execute(request: CreateClientDTO): Promise<Response> {
    let account: Account;

    const { accountId, name, birthDate, email, phone, surname } = request;

    try {
      account = await this.accountRepo.findAccountByAccountId(AccountId.create(new UniqueEntityID(accountId)).getValue());
    } catch (error) {
      return Result.fail(error.message);
    }

    try {
      const newClient = Client.create(
        {
          accountId: account.accountId.id.getValue(),
          name: name,
          status: ClientStatus.Active,
          surname: surname,
          birthDay: birthDate,
          email: email,
          phone: phone,
        },
        new UniqueEntityID(),
      );

      if (newClient.isFailure) {
        return Result.fail(newClient.error);
      }

      await this.clientRepo.save(newClient.getValue());

      return Result.ok({ message: 'Client created.', clientId: newClient.getValue().clientId.value });
    } catch (error) {
      return Result.fail(error.message);
    }
  }
}
