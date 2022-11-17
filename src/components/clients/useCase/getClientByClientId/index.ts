import { ClientRepository } from '../../repo';
import { GetClientByClientIdController } from './GetClientByClientIdController';
import { GetClientByClientIdUseCase } from './GetClientByClientIdUseCase';

const getClientByClientIdUseCase = new GetClientByClientIdUseCase(ClientRepository);
const getClientByClientId = new GetClientByClientIdController(getClientByClientIdUseCase);

export { getClientByClientId };
