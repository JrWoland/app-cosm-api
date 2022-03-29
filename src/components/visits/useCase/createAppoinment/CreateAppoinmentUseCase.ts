import { UseCase } from '../../../../core/domain/UseCase';
import { Result } from '../../../../core/logic/Result';
import { CreateAppoinmentDTO } from './CreateAppoinmentDTO';

type Response = Result<any>;
export class CreateAppoinmentUseCase implements UseCase<CreateAppoinmentDTO, Promise<Response>> {
  execute(request: CreateAppoinmentDTO): Promise<Response> {
    throw new Error('Method not implemented.');
  }
}
