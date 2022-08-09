import { AccountRepository } from '../../../accounts/repo';
import { ClientRepository } from '../../repo';
import { UpdateClientController } from './UpdateClientController';
import { UpdateClientUseCase } from './UpdateClientUseCase';

const updateClientUseCase = new UpdateClientUseCase(ClientRepository, AccountRepository);
const updateClientController = new UpdateClientController(updateClientUseCase);

export { updateClientController };
