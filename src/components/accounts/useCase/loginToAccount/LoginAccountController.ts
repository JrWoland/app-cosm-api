import { BaseController } from '../../../../core/infra/BaseController';
import { LoginAccountDTO, LoggedAccountDTO } from './LoginAccountDTO';
import { LoginAccountUseCase } from './LoginAccountUsecCase';

export class LoginAccountController extends BaseController {
  private useCase: LoginAccountUseCase;

  constructor(useCase: LoginAccountUseCase) {
    super();
    this.useCase = useCase;
  }

  private loggedIn(dto: LoggedAccountDTO) {
    return this.res
      .cookie('access_token', dto.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        signed: true,
        maxAge: 1000 * 60 * 60 * 24,
      })
      .status(200)
      .json({ message: 'Logged in successfully.', token: dto.token });
  }

  async executeImpl(): Promise<any> {
    const loginAccountDTO: LoginAccountDTO = this.req.body;

    try {
      const result = await this.useCase.execute(loginAccountDTO);

      if (result.isSuccess) {
        this.loggedIn(result.getValue());
      } else {
        this.unprocesable(result.error?.toString());
      }
    } catch (error: any) {
      this.fail('Could not log in.');
    }
  }
}
