import { BaseController } from '../../../../core/infra/BaseController';
import { CreateAppoinmentDTO } from './CreateAppoinmentDTO';
import { CreateAppoinmentUseCase } from './CreateAppoinmentUseCase';

export class CreateAccountController extends BaseController {
  constructor(private useCase: CreateAppoinmentUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(): Promise<any> {
    const newAppoinmentDTO: CreateAppoinmentDTO = this.req.body;

    try {
      const result = await this.useCase.execute(newAppoinmentDTO);

      if (result.isSuccess) {
        this.created(result.getValue());
      } else {
        this.unprocesable(result.error);
      }
    } catch (error: any) {
      return this.fail(error.message);
    }
  }
}
