import { AppoinmentRepository } from '../../repo';
import { CreateAppoinmentUseCase } from './CreateAppoinmentUseCase';
import { CreateAppoinmentController } from './CreateAppoinmentController';
import { AccountRepository } from '../../../accounts/repo';

const createAppoinmentUseCase = new CreateAppoinmentUseCase(AppoinmentRepository, AccountRepository);
const createAppoinmentController = new CreateAppoinmentController(createAppoinmentUseCase);

export { createAppoinmentController };
