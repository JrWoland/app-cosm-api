import { BaseController } from '../../../../core/infra/BaseController';
import { CreateAccountDTO } from './CreateAccountDTO';
import { CreateAccountUseCase } from './CreateAccountUseCase';

export class CreateAccountController extends BaseController {
  private useCase: CreateAccountUseCase;
  constructor(useCase: CreateAccountUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(): Promise<any> {
    const newAccountDTO: CreateAccountDTO = this.req.body;

    try {
      const result = await this.useCase.execute(newAccountDTO);

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
