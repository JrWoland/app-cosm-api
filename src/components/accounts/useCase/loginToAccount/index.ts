import { AccountRepository } from '../../repo';
import { LoginAccountController } from './LoginAccountController';
import { LoginAccountUseCase } from './LoginAccountUsecCase';

const loginAccountUseCase = new LoginAccountUseCase(AccountRepository);
const loginAccountController = new LoginAccountController(loginAccountUseCase);

export { loginAccountUseCase, loginAccountController };
