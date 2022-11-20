import { ClientRepository } from '../../repo';
import { GetClientByClientIdController } from './GetClientByClientIdController';
import { GetClientByClientIdUseCase } from './GetClientByClientIdUseCase';

const getClientByClientIdUseCase = new GetClientByClientIdUseCase(ClientRepository);
const getClientByClientIdController = new GetClientByClientIdController(getClientByClientIdUseCase);

export { getClientByClientIdController };
