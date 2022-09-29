import { AccountRepository } from '../../../accounts/repo';
import { TreatmentRepository } from '../../repo';
import { CreateTreatmentController } from './CreateTreatmentController';
import { CreateTreatmentUseCase } from './CreateTreatmentUseCase';

const createTreatmentUseCase = new CreateTreatmentUseCase(TreatmentRepository, AccountRepository);
const createTreatmentController = new CreateTreatmentController(createTreatmentUseCase);

export { createTreatmentController };
