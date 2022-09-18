import { AccountRepository } from '../../../accounts/repo';
import { ClientRepository } from '../../repo';
import { UpdateClientStatusController } from './UpdateClientStatusController';
import { UpdateClientStatusUseCase } from './UpdateClientStatusUseCase';

const updateClientUseCase = new UpdateClientStatusUseCase(ClientRepository, AccountRepository);
const updateClientStatusController = new UpdateClientStatusController(updateClientUseCase);

export { updateClientStatusController };
