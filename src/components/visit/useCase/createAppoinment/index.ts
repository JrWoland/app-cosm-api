import { AppoinmentRepository, TreatmentRepository } from '../../repo';
import { CreateAppoinmentUseCase } from './CreateAppoinmentUseCase';
import { CreateAppoinmentController } from './CreateAppoinmentController';
import { AccountRepository } from '../../../accounts/repo';

const createAppoinmentUseCase = new CreateAppoinmentUseCase(AppoinmentRepository, AccountRepository, TreatmentRepository);
const createAppoinmentController = new CreateAppoinmentController(createAppoinmentUseCase);

export { createAppoinmentController };
