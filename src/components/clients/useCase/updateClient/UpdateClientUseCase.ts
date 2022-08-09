import { UseCase } from '../../../../core/domain/UseCase';
import { Result } from '../../../../core/logic/Result';
import { UniqueEntityID } from '../../../../core/domain/UniqueId';
import { UpdateClientDTO } from './UpdateClientDTO';
import { IClientRepo } from '../../repo/ClientRepo';
import { IAccountRepo } from '../../../accounts/repo/AccountRepo';

interface UpdateClientResponseDTO {
  message: string;
  clientId: string;
}

type Response = Result<UpdateClientResponseDTO>;

export class UpdateClientUseCase implements UseCase<UpdateClientDTO, Promise<Response>> {
  constructor(private clientRepo: IClientRepo, private accountRepo: IAccountRepo) {}

  execute(request: UpdateClientDTO): Promise<Response> {
    throw new Error('Method not implemented.');
  }
}
