import { UseCase } from '../../../../core/domain/UseCase';
import { Result } from '../../../../core/logic/Result';
import { UniqueEntityID } from '../../../../core/domain/UniqueId';
import { CreateClientDTO } from './CreateClientDTO';
import { IClientRepo } from '../../repo/ClientRepo';
import { IAccountRepo } from '../../../accounts/repo/AccountRepo';

interface ClientResponseDTO {
  message: string;
  clientId: string;
}

type Response = Result<ClientResponseDTO>;

export class CreateClientUseCase implements UseCase<CreateClientDTO, Promise<Response>> {
  constructor(private clientRepo: IClientRepo, private accountRepo: IAccountRepo) {}

  execute(request: CreateClientDTO): Promise<Response> {
    throw new Error('Method not implemented.');
  }
}
