import { AccountRepository } from '../../repo';
import { authService } from '../../services/index';
import { LoginAccountController } from './LoginAccountController';
import { LoginAccountUseCase } from './LoginAccountUsecCase';

const loginAccountUseCase = new LoginAccountUseCase(AccountRepository, authService);
const loginAccountController = new LoginAccountController(loginAccountUseCase);

export { loginAccountUseCase, loginAccountController };
