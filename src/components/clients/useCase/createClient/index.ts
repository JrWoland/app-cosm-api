import { AccountRepository } from '../../../accounts/repo';
import { ClientRepository } from '../../repo';
import { CreateClientController } from './CreateClientController';
import { CreateClientUseCase } from './CreateClientUseCase';

const createClientUseCase = new CreateClientUseCase(ClientRepository, AccountRepository);
const createClientController = new CreateClientController(createClientUseCase);

export { createClientController };
