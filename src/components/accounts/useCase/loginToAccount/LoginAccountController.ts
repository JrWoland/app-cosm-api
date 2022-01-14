import { BaseController } from '../../../../core/infra/BaseController';
import { LoginAccountDTO, LoggedAccountDTO } from './LoginAccountDTO';
import { LoginAccountUseCase } from './LoginAccountUsecCase';

export class LoginAccountController extends BaseController {
  private useCase: LoginAccountUseCase;
  constructor(useCase: LoginAccountUseCase) {
    super();
    this.useCase = useCase;
  }

  async executeImpl(): Promise<any> {
    const loginAccountDTO: LoginAccountDTO = this.req.body;

    try {
      const result = await this.useCase.execute(loginAccountDTO);

      if (result.isSuccess) {
        this.ok<LoggedAccountDTO>(this.res, result.getValue());
      } else {
        this.unprocesable(result.error?.toString());
      }
    } catch (error: any) {
      return this.fail(error.message);
    }
  }
}
