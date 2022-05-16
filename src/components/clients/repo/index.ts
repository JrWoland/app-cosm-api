import { ClientModel } from '../../../infra/db/models/clientModel';
import { ClientRepo } from './ClientRepo';

const ClientRepository = new ClientRepo(ClientModel);

export { ClientRepository };
