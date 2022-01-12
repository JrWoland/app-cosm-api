import { AccountRepository } from '../../repo';
import { CreateAccountController } from './CreateAccountController';
import { CreateAccountUseCase } from './CreateAccountUseCase';

const createAccountUseCase = new CreateAccountUseCase(AccountRepository);
const createAccountController = new CreateAccountController(createAccountUseCase);

export { createAccountUseCase, createAccountController };
